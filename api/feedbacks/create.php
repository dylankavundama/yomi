<?php
// api/feedbacks/create.php

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

$name = trim($inputData['name'] ?? '');
$email = trim($inputData['email'] ?? '');
$rating = (int)($inputData['rating'] ?? 0);
$comment = trim($inputData['comment'] ?? '');

if (empty($name) || empty($email) || empty($comment) || $rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires et fournir une note valide (1-5).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse e-mail invalide.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO platform_feedbacks (name, email, rating, comment, is_approved) VALUES (?, ?, ?, ?, 0)");
    $stmt->execute([$name, $email, $rating, $comment]);

    echo json_encode([
        'success' => true,
        'message' => 'Votre avis a été soumis avec succès ! Il sera affiché après validation par un administrateur.'
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'enregistrement de votre avis : ' . $e->getMessage()
    ]);
}
