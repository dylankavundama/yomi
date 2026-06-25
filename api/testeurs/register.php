<?php
// api/testeurs/register.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Migration dynamique : s'assurer que la table testeurs existe
$pdo->exec("CREATE TABLE IF NOT EXISTS testeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) DEFAULT NULL,
    source VARCHAR(100) DEFAULT 'landing_page',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB");

$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

$email = trim($inputData['email'] ?? '');
$name = trim($inputData['name'] ?? '');

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir l\'adresse e-mail.']);
    exit;
}

// Validation syntaxique
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format de l\'adresse e-mail invalide.']);
    exit;
}

// Validation DNS du domaine
$domain = substr(strrchr($email, "@"), 1);
if (!checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Cette adresse e-mail semble être fictive. Le domaine (@' . $domain . ') n\'existe pas.'
    ]);
    exit;
}

// Générer le nom à partir de l'email si absent
if (empty($name)) {
    $parts = explode('@', $email);
    $name = ucwords(str_replace(['.', '-', '_'], ' ', $parts[0]));
}

try {
    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM testeurs WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Cette adresse e-mail est déjà enregistrée dans la liste des testeurs.']);
        exit;
    }

    // Insérer le nouveau testeur
    $insertStmt = $pdo->prepare("INSERT INTO testeurs (email, name, source) VALUES (?, ?, 'landing_page')");
    $insertStmt->execute([$email, $name]);

    echo json_encode([
        'success' => true,
        'message' => 'Testeur enregistré avec succès !'
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()
    ]);
}
