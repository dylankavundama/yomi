<?php
// api/apps/create.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupérer l'utilisateur authentifié
$user = getAuthenticatedUser($pdo);
$userId = $user['id'];

// Récupérer le corps de la requête
$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

// Validation des champs obligatoires
$title = trim($inputData['title'] ?? '');
$description = trim($inputData['description'] ?? '');
$platform = trim($inputData['platform'] ?? '');
$appUrl = trim($inputData['app_url'] ?? '');
$instructions = trim($inputData['instructions'] ?? '');
$testerLimit = (int)($inputData['tester_limit'] ?? 5);

if (empty($title) || empty($description) || empty($platform) || empty($appUrl) || empty($instructions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs obligatoires doivent être renseignés.']);
    exit;
}

// Vérifier que la plateforme est valide
$allowedPlatforms = ['Web', 'Android', 'iOS', 'Windows', 'macOS', 'Linux'];
if (!in_array($platform, $allowedPlatforms)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Plateforme non reconnue.']);
    exit;
}

if ($testerLimit < 1) {
    $testerLimit = 1;
}

try {
    $stmt = $pdo->prepare("INSERT INTO applications (user_id, title, description, platform, app_url, instructions, tester_limit) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $title, $description, $platform, $appUrl, $instructions, $testerLimit]);
    
    $appId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Application soumise avec succès !',
        'app_id' => $appId
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la soumission : ' . $e->getMessage()
    ]);
}
