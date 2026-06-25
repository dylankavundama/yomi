<?php
// api/apps/list.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Récupérer le filtre
$filter = $_GET['filter'] ?? 'to_test';

// Si le filtre n'est pas public_latest, l'authentification est requise
$userId = null;
if ($filter !== 'public_latest') {
    $user = getAuthenticatedUser($pdo);
    $userId = $user['id'];
}

try {
    if ($filter === 'public_latest') {
        // Les 8 dernières applications (actives ou terminées) envoyées par les développeurs
        $stmt = $pdo->prepare("
            SELECT a.*, u.name as developer_name, u.picture as developer_picture,
                   (SELECT COUNT(*) FROM test_reviews r WHERE r.app_id = a.id) as current_reviews
            FROM applications a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 8
        ");
        $stmt->execute();
        $apps = $stmt->fetchAll();
    } elseif ($filter === 'my_apps') {
        // Liste des applications créées par l'utilisateur
        $stmt = $pdo->prepare("
            SELECT a.*, 
                   (SELECT COUNT(*) FROM test_reviews r WHERE r.app_id = a.id) as current_reviews
            FROM applications a
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
        ");
        $stmt->execute([$userId]);
        $apps = $stmt->fetchAll();
    } else {
        // Liste des applications disponibles à tester (créées par d'autres, pas encore testées par l'utilisateur)
        $stmt = $pdo->prepare("
            SELECT a.*, u.name as developer_name, u.picture as developer_picture,
                   (SELECT COUNT(*) FROM test_reviews r WHERE r.app_id = a.id) as current_reviews
            FROM applications a
            JOIN users u ON a.user_id = u.id
            WHERE a.user_id != ? 
              AND a.status = 'active'
              AND NOT EXISTS (
                  SELECT 1 FROM test_reviews r WHERE r.app_id = a.id AND r.tester_id = ?
              )
            ORDER BY a.created_at DESC
        ");
        $stmt->execute([$userId, $userId]);
        $apps = $stmt->fetchAll();
    }

    echo json_encode([
        'success' => true,
        'apps' => $apps
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des applications : ' . $e->getMessage()
    ]);
}
