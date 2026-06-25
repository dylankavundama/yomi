<?php
// api/apps/update_status.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupérer l'utilisateur authentifié
$user = getAuthenticatedUser($pdo);
$userId = $user['id'];

// Récupérer le corps de la requête
$data = json_decode(file_get_contents('php://input'), true);
$appId = isset($data['app_id']) ? (int)$data['app_id'] : 0;
$status = $data['status'] ?? '';
$devFeedback = $data['dev_feedback'] ?? null;
$prodUrl = $data['prod_url'] ?? null;

if ($appId <= 0 || !in_array($status, ['active', 'completed'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données de statut invalides.']);
    exit;
}

try {
    // Vérifier la propriété de l'application
    $stmt = $pdo->prepare("SELECT id FROM applications WHERE id = ? AND user_id = ?");
    $stmt->execute([$appId, $userId]);
    $app = $stmt->fetch();

    if (!$app) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Vous n\'êtes pas autorisé à modifier cette application.']);
        exit;
    }

    // Validation si complété/terminé
    if ($status === 'completed') {
        if (empty($devFeedback) || trim($devFeedback) === '') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'L\'avis du développeur est requis pour terminer la phase de test.']);
            exit;
        }
        if (empty($prodUrl) || trim($prodUrl) === '' || !filter_var($prodUrl, FILTER_VALIDATE_URL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Un lien valide de la version en production est requis.']);
            exit;
        }
    } else {
        // Si on repasse en 'active', on réinitialise ou garde les valeurs (selon choix - on va simplement les mettre à null ou les laisser facultatives)
        // Laisser les valeurs précédentes au cas où, ou les mettre à NULL
        $devFeedback = null;
        $prodUrl = null;
    }

    // Mettre à jour l'application
    $updateStmt = $pdo->prepare("
        UPDATE applications 
        SET status = ?, dev_feedback = ?, prod_url = ? 
        WHERE id = ?
    ");
    $updateStmt->execute([$status, $devFeedback, $prodUrl, $appId]);

    echo json_encode([
        'success' => true,
        'message' => 'Statut de l\'application mis à jour avec succès.',
        'app' => [
            'id' => $appId,
            'status' => $status,
            'dev_feedback' => $devFeedback,
            'prod_url' => $prodUrl
        ]
    ]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour : ' . $e->getMessage()
    ]);
}
