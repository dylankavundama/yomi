<?php
// api/profile.php

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/auth_helper.php';

// Attendre uniquement des requêtes GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Récupérer l'utilisateur authentifié
$user = getAuthenticatedUser($pdo);
$userId = $user['id'];

try {
    // 1. Stats personnelles
    // Nombre d'applications publiées par l'utilisateur
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM applications WHERE user_id = ?");
    $stmt->execute([$userId]);
    $appsCreated = (int)$stmt->fetchColumn();
    
    // Nombre de tests soumis par l'utilisateur
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM test_reviews WHERE tester_id = ?");
    $stmt->execute([$userId]);
    $testsDone = (int)$stmt->fetchColumn();
    
    // 2. Stats globales de la plateforme
    // Total d'applications actives
    $totalAppsStmt = $pdo->query("SELECT COUNT(*) FROM applications");
    $totalApps = (int)$totalAppsStmt->fetchColumn();
    
    // Total de rapports de tests
    $totalReviewsStmt = $pdo->query("SELECT COUNT(*) FROM test_reviews");
    $totalReviews = (int)$totalReviewsStmt->fetchColumn();

    // Total d'utilisateurs
    $totalUsersStmt = $pdo->query("SELECT COUNT(*) FROM users");
    $totalUsers = (int)$totalUsersStmt->fetchColumn();

    // 3. Invitations de tests actives (l'utilisateur fait partie des participants d'un test actif et n'a pas encore fait de retour)
    $invitationsStmt = $pdo->prepare("
        SELECT a.id as app_id, a.title as app_title, u.name as developer_name
        FROM participants p
        JOIN applications a ON p.app_id = a.id
        JOIN users u ON a.user_id = u.id
        WHERE p.email = ?
          AND a.status = 'active'
          AND NOT EXISTS (
              SELECT 1 FROM test_reviews r 
              WHERE r.app_id = a.id AND r.tester_id = ?
          )
        ORDER BY p.created_at DESC
    ");
    $invitationsStmt->execute([$user['email'], $userId]);
    $invitations = $invitationsStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'picture' => $user['picture'],
            'created_at' => $user['created_at']
        ],
        'stats' => [
            'apps_created' => $appsCreated,
            'tests_done' => $testsDone,
            'global' => [
                'total_apps' => $totalApps,
                'total_reviews' => $totalReviews,
                'total_users' => $totalUsers
            ]
        ],
        'invitations' => $invitations
    ]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des statistiques : ' . $e->getMessage()
    ]);
}
