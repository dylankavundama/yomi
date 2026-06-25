<?php
// api/apps/participants_list.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

$user = getAuthenticatedUser($pdo);
$userId = $user['id'];

$appId = isset($_GET['app_id']) ? (int)$_GET['app_id'] : 0;
if ($appId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Paramètre app_id invalide.']);
    exit;
}

try {
    // Vérifier que l'application appartient bien à l'utilisateur connecté
    $appStmt = $pdo->prepare("SELECT id FROM applications WHERE id = ? AND user_id = ?");
    $appStmt->execute([$appId, $userId]);
    if (!$appStmt->fetch()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Accès refusé. Vous n\'êtes pas le développeur de cette application.']);
        exit;
    }

    // S'assurer que la table des participants existe
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS participants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            app_id INT NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (app_id) REFERENCES applications(id) ON DELETE CASCADE,
            UNIQUE KEY unique_app_email (app_id, email)
        ) ENGINE=InnoDB;
    ");

    // Récupérer les participants
    $stmt = $pdo->prepare("
        SELECT p.id, p.email, p.created_at, u.name, u.picture
        FROM participants p
        LEFT JOIN users u ON p.email = u.email
        WHERE p.app_id = ?
        ORDER BY p.created_at DESC
    ");
    $stmt->execute([$appId]);
    $participants = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'participants' => $participants
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des participants : ' . $e->getMessage()
    ]);
}
