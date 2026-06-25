<?php
// api/apps/details.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Récupérer l'utilisateur authentifié
$user = getAuthenticatedUser($pdo);
$userId = $user['id'];

// Récupérer l'ID de l'application
$appId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($appId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID d\'application manquant ou invalide.']);
    exit;
}

try {
    // Récupérer l'application et les infos du développeur
    $stmt = $pdo->prepare("
        SELECT a.*, u.name as developer_name, u.picture as developer_picture, u.email as developer_email
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = ?
    ");
    $stmt->execute([$appId]);
    $app = $stmt->fetch();
    
    if (!$app) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Application introuvable.']);
        exit;
    }
    
    // Compter le nombre de tests soumis
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM test_reviews WHERE app_id = ?");
    $countStmt->execute([$appId]);
    $currentReviewsCount = (int)$countStmt->fetchColumn();
    $app['current_reviews'] = $currentReviewsCount;
    
    // Vérifier si l'utilisateur connecté a déjà testé cette application
    $reviewStmt = $pdo->prepare("SELECT id FROM test_reviews WHERE app_id = ? AND tester_id = ?");
    $reviewStmt->execute([$appId, $userId]);
    $hasTested = $reviewStmt->fetch() ? true : false;
    
    echo json_encode([
        'success' => true,
        'app' => $app,
        'has_tested' => $hasTested
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des détails : ' . $e->getMessage()
    ]);
}
