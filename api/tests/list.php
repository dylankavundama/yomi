<?php
// api/tests/list.php

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
$appId = isset($_GET['app_id']) ? (int)$_GET['app_id'] : 0;

if ($appId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID d\'application manquant ou invalide.']);
    exit;
}

try {
    // 1. Récupérer l'application pour vérifier la propriété
    $stmt = $pdo->prepare("SELECT user_id, title FROM applications WHERE id = ?");
    $stmt->execute([$appId]);
    $app = $stmt->fetch();
    
    if (!$app) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Application introuvable.']);
        exit;
    }
    
    // 2. Vérifier si l'utilisateur connecté est bien le développeur de l'application
    if ($app['user_id'] != $userId) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Accès refusé. Seul le développeur de cette application peut consulter les rapports de test.']);
        exit;
    }
    
    // 3. Récupérer la liste des rapports avec les détails du testeur
    $reviewsStmt = $pdo->prepare("
        SELECT r.*, u.name as tester_name, u.picture as tester_picture, u.email as tester_email
        FROM test_reviews r
        JOIN users u ON r.tester_id = u.id
        WHERE r.app_id = ?
        ORDER BY r.created_at DESC
    ");
    $reviewsStmt->execute([$appId]);
    $reviews = $reviewsStmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'app_title' => $app['title'],
        'reviews' => $reviews
    ]);
    
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors du chargement des rapports : ' . $e->getMessage()
    ]);
}
