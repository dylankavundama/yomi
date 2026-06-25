<?php
// api/feedbacks/list_approved.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

try {
    $stmt = $pdo->query("SELECT id, name, rating, comment, created_at FROM platform_feedbacks WHERE is_approved = 1 ORDER BY created_at DESC");
    $feedbacks = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'feedbacks' => $feedbacks
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des avis : ' . $e->getMessage()
    ]);
}
