<?php
// api/apps/track_send.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupérer l'utilisateur authentifié (le développeur de l'application)
$user = getAuthenticatedUser($pdo);
$userId = $user['id'];

// Récupérer les données de la requête
$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

$appId = isset($inputData['app_id']) ? (int)$inputData['app_id'] : 0;
$count = isset($inputData['count']) ? (int)$inputData['count'] : 0;

if ($appId <= 0 || $count <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Paramètres app_id ou count invalides.']);
    exit;
}

try {
    // Vérifier si l'application appartient bien à l'utilisateur connecté
    $stmt = $pdo->prepare("SELECT id FROM applications WHERE id = ? AND user_id = ?");
    $stmt->execute([$appId, $userId]);
    $app = $stmt->fetch();
    
    if (!$app) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Accès refusé. Vous n\'êtes pas le développeur de cette application.']);
        exit;
    }
    
    // Mettre à jour le compteur d'e-mails envoyés
    $updateStmt = $pdo->prepare("UPDATE applications SET emails_sent = emails_sent + ? WHERE id = ?");
    $updateStmt->execute([$count, $appId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Compteur d\'invitations e-mail mis à jour avec succès.'
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de base de données : ' . $e->getMessage()
    ]);
}
