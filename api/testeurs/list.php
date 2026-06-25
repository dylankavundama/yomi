<?php
// api/testeurs/list.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Authentification requise
$user = getAuthenticatedUser($pdo);

// Migration dynamique
$pdo->exec("CREATE TABLE IF NOT EXISTS testeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) DEFAULT NULL,
    source VARCHAR(100) DEFAULT 'landing_page',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB");

try {
    $stmt = $pdo->query("SELECT * FROM testeurs ORDER BY created_at DESC");
    $testeurs = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'testeurs' => $testeurs
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des testeurs : ' . $e->getMessage()
    ]);
}
