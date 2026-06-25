<?php
// api/feedbacks/admin_list.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Vérifier l'authentification et le rôle admin
$user = getAuthenticatedUser($pdo);
if (($user['role'] ?? 'user') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Accès refusé. Rôle administrateur requis.']);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM platform_feedbacks ORDER BY created_at DESC");
    $feedbacks = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'feedbacks' => $feedbacks
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération de la liste d\'administration des avis : ' . $e->getMessage()
    ]);
}
