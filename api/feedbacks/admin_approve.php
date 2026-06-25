<?php
// api/feedbacks/admin_approve.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Vérifier l'authentification et le rôle admin
$user = getAuthenticatedUser($pdo);
if (($user['role'] ?? 'user') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Accès refusé. Rôle administrateur requis.']);
    exit;
}

$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData || !isset($inputData['id']) || !isset($inputData['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides (id et action requis).']);
    exit;
}

$feedbackId = (int)$inputData['id'];
$action = $inputData['action']; // 'approve', 'disapprove', 'delete'

try {
    if ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM platform_feedbacks WHERE id = ?");
        $stmt->execute([$feedbackId]);
        echo json_encode([
            'success' => true,
            'message' => 'Avis supprimé avec succès.'
        ]);
    } else {
        $status = ($action === 'approve') ? 1 : 0;
        $stmt = $pdo->prepare("UPDATE platform_feedbacks SET is_approved = ? WHERE id = ?");
        $stmt->execute([$status, $feedbackId]);
        echo json_encode([
            'success' => true,
            'message' => $status ? 'Avis approuvé et visible sur le site.' : 'Avis désapprouvé et masqué du site.'
        ]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de base de données lors de la modération de l\'avis : ' . $e->getMessage()
    ]);
}
