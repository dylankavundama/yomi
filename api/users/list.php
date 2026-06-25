<?php
// api/users/list.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Récupérer l'utilisateur authentifié (vérifie la validité de la session)
$user = getAuthenticatedUser($pdo);

try {
    // Récupère tous les utilisateurs de la plateforme triés par nombre de tests effectués desc, puis par date d'inscription
    $stmt = $pdo->query("
        SELECT u.id, u.name, u.email, u.picture, u.created_at,
               (SELECT COUNT(*) FROM test_reviews r WHERE r.tester_id = u.id) as tests_done,
               (SELECT COUNT(*) FROM applications a WHERE a.user_id = u.id) as apps_created
        FROM users u
        ORDER BY tests_done DESC, u.created_at DESC
    ");
    $users = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'users' => $users
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération de la liste des utilisateurs : ' . $e->getMessage()
    ]);
}
