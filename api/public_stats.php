<?php
// api/public_stats.php

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

try {
    // Migration dynamique : s'assurer que la table testeurs existe
    $pdo->exec("CREATE TABLE IF NOT EXISTS testeurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) DEFAULT NULL,
        source VARCHAR(100) DEFAULT 'landing_page',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");

    // Nombre total de testeurs (table dédiée testeurs)
    $stmtTesteurs = $pdo->query("SELECT COUNT(*) FROM testeurs");
    $totalTesters = (int)$stmtTesteurs->fetchColumn();

    // Nombre total d'utilisateurs (table users)
    $stmtUsers = $pdo->query("SELECT COUNT(*) FROM users");
    $totalUsers = (int)$stmtUsers->fetchColumn();

    // Nombre d'applications publiées
    $stmtApps = $pdo->query("SELECT COUNT(*) FROM applications");
    $totalApps = (int)$stmtApps->fetchColumn();

    // Nombre de rapports soumis
    $stmtReviews = $pdo->query("SELECT COUNT(*) FROM test_reviews");
    $totalReviews = (int)$stmtReviews->fetchColumn();

    echo json_encode([
        'success' => true,
        'stats' => [
            'testers' => $totalTesters,
            'apps' => $totalApps,
            'reviews' => $totalReviews
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors du calcul des statistiques : ' . $e->getMessage()
    ]);
}
