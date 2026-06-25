<?php
// api/auth/google.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupérer les données brutes de la requête
$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

$googleId = null;
$email = null;
$name = null;
$picture = null;

// Authentification Google Réelle
$credential = $inputData['credential'] ?? null;
    
    if (!$credential) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Jeton d\'authentification manquant.']);
        exit;
    }
    
    // Valider le jeton avec l'API Google
    $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($credential);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Activer la vérification SSL
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200 || !$response) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Jeton Google invalide ou expiré.']);
        exit;
    }
    
    $payload = json_decode($response, true);
    
    if (!isset($payload['sub']) || !isset($payload['email'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Données Google incomplètes.']);
        exit;
    }
    
    $googleId = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'] ?? explode('@', $email)[0];
    $picture = $payload['picture'] ?? null;

try {
    // 1. Vérifier si l'utilisateur existe déjà par google_id
    $stmt = $pdo->prepare("SELECT * FROM users WHERE google_id = ?");
    $stmt->execute([$googleId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        // 2. Vérifier si l'utilisateur existe déjà par email (créé manuellement au préalable)
        $stmtEmail = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmtEmail->execute([$email]);
        $userByEmail = $stmtEmail->fetch();
        
        // Déterminer le rôle (Par défaut 'user' ou le rôle mocké)
        $determinedRole = isset($role) ? $role : 'user';
        
        // Si l'utilisateur existait déjà par email, on garde son rôle existant
        if ($userByEmail && !isset($role)) {
            $determinedRole = $userByEmail['role'];
        }
        
        if ($userByEmail) {
            // Associer le google_id réel au compte existant et mettre à jour le profil et le rôle
            $updateStmt = $pdo->prepare("UPDATE users SET google_id = ?, name = ?, picture = ?, role = ? WHERE id = ?");
            $updateStmt->execute([$googleId, $name, $picture, $determinedRole, $userByEmail['id']]);
            
            // Récupérer l'utilisateur mis à jour
            $stmt->execute([$googleId]);
            $user = $stmt->fetch();
        } else {
            // Créer un nouvel utilisateur
            $insertStmt = $pdo->prepare("INSERT INTO users (google_id, email, name, picture, role) VALUES (?, ?, ?, ?, ?)");
            $insertStmt->execute([$googleId, $email, $name, $picture, $determinedRole]);
            
            // Récupérer le nouvel utilisateur
            $stmt->execute([$googleId]);
            $user = $stmt->fetch();
        }
    } else {
        // Déterminer le rôle à mettre à jour si nécessaire (garder le rôle existant de la DB)
        $newRole = $user['role'];
        if (isset($role)) {
            $newRole = $role;
        }
        
        // Mettre à jour les infos de l'utilisateur au cas où elles auraient changé chez Google
        $updateStmt = $pdo->prepare("UPDATE users SET name = ?, picture = ?, role = ? WHERE id = ?");
        $updateStmt->execute([$name, $picture, $newRole, $user['id']]);
        
        $user['name'] = $name;
        $user['picture'] = $picture;
        $user['role'] = $newRole;
    }
    
    // Générer un jeton d'authentification sécurisé
    $authToken = bin2hex(random_bytes(32));
    $updateTokenStmt = $pdo->prepare("UPDATE users SET auth_token = ? WHERE id = ?");
    $updateTokenStmt->execute([$authToken, $user['id']]);
    
    // Auto-ajouter à la liste des testeurs (INSERT IGNORE évite les doublons)
    $insertTesteurStmt = $pdo->prepare("INSERT IGNORE INTO testeurs (email, name, source) VALUES (?, ?, 'google_auth')");
    $insertTesteurStmt->execute([$user['email'], $user['name']]);
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'google_id' => $user['google_id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'picture' => $user['picture'],
            'role' => $user['role'] ?? 'user',
            'auth_token' => $authToken,
            'created_at' => $user['created_at']
        ]
    ]);
    
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de base de données : ' . $e->getMessage()
    ]);
}
