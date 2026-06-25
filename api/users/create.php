<?php
// api/users/create.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupérer les données brutes
$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

$email = trim($inputData['email'] ?? '');
$name = trim($inputData['name'] ?? '');

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir l\'adresse e-mail.']);
    exit;
}

if (empty($name)) {
    // Générer le nom à partir de l'adresse e-mail
    $parts = explode('@', $email);
    $namePart = $parts[0];
    $name = ucwords(str_replace(['.', '-', '_'], ' ', $namePart));
}

// 1. Validation syntaxique de l'adresse e-mail
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format de l\'adresse e-mail invalide.']);
    exit;
}

// 2. Validation DNS du domaine (Vérifier si le domaine de messagerie existe réellement)
$domain = substr(strrchr($email, "@"), 1);
if (!checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Cette adresse e-mail semble être fictive. Le domaine de messagerie (@' . $domain . ') n\'existe pas ou n\'a pas de serveur d\'envoi valide.'
    ]);
    exit;
}

try {
    // 3. Vérifier si l'e-mail existe déjà en base de données
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Cette adresse e-mail est déjà enregistrée dans la base de données.']);
        exit;
    }
    
    // 4. Insérer le nouveau testeur
    $googleId = 'manual_' . md5(strtolower($email));
    // Avatar générique par défaut
    $picture = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150';
    
    $insertStmt = $pdo->prepare("INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)");
    $insertStmt->execute([$googleId, $email, $name, $picture]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Testeur enregistré avec succès dans la base de données.'
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()
    ]);
}
