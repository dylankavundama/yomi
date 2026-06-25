<?php
// api/apps/participate.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

$inputData = json_decode(file_get_contents('php://input'), true);
if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

$appId = isset($inputData['app_id']) ? (int)$inputData['app_id'] : 0;
$email = trim($inputData['email'] ?? '');

if ($appId <= 0 || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Paramètres app_id ou email manquants.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format d\'adresse e-mail invalide.']);
    exit;
}

try {
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

    // 1. Vérifier ou insérer l'utilisateur dans la table des utilisateurs
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $userExists = $stmt->fetch();

    if (!$userExists) {
        $googleId = 'manual_' . md5(strtolower($email));
        $picture = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150';
        $parts = explode('@', $email);
        $namePart = $parts[0];
        $name = ucwords(str_replace(['.', '-', '_'], ' ', $namePart));

        $insertUserStmt = $pdo->prepare("INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)");
        $insertUserStmt->execute([$googleId, $email, $name, $picture]);
    }

    // 2. Insérer dans la table des participants
    $insertParticipantStmt = $pdo->prepare("INSERT IGNORE INTO participants (app_id, email) VALUES (?, ?)");
    $insertParticipantStmt->execute([$appId, $email]);

    echo json_encode([
        'success' => true,
        'message' => 'Inscription réussie.'
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la participation : ' . $e->getMessage()
    ]);
}
