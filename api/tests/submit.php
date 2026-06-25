<?php
// api/tests/submit.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupérer l'utilisateur authentifié (le testeur)
$user = getAuthenticatedUser($pdo);
$testerId = $user['id'];

// Récupérer le corps de la requête
$inputData = json_decode(file_get_contents('php://input'), true);

if (!$inputData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides.']);
    exit;
}

$appId = isset($inputData['app_id']) ? (int)$inputData['app_id'] : 0;
$rating = isset($inputData['rating']) ? (int)$inputData['rating'] : 0;
$feedback = trim($inputData['feedback'] ?? '');
$bugsFound = trim($inputData['bugs_found'] ?? '');
$deviceInfo = trim($inputData['device_info'] ?? 'Inconnu');

if ($appId <= 0 || $rating < 1 || $rating > 5 || empty($feedback)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données manquantes ou invalides (la note doit être entre 1 et 5, et le feedback rempli).']);
    exit;
}

try {
    // 1. Vérifier si l'application existe et récupérer ses détails
    $stmt = $pdo->prepare("SELECT * FROM applications WHERE id = ?");
    $stmt->execute([$appId]);
    $app = $stmt->fetch();
    
    if (!$app) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Application introuvable.']);
        exit;
    }
    
    // 2. Empêcher le développeur de tester sa propre application
    if ($app['user_id'] == $testerId) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Vous ne pouvez pas tester votre propre application.']);
        exit;
    }
    
    // 3. Vérifier si l'application est toujours active
    if ($app['status'] !== 'active') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Cette application a déjà reçu tous les tests demandés.']);
        exit;
    }
    
    // 4. Vérifier si le testeur a déjà soumis un rapport pour cette application
    $stmt = $pdo->prepare("SELECT id FROM test_reviews WHERE app_id = ? AND tester_id = ?");
    $stmt->execute([$appId, $testerId]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Vous avez déjà soumis un rapport pour cette application.']);
        exit;
    }
    
    // 5. Compter les reviews actuelles pour vérifier la limite
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM test_reviews WHERE app_id = ?");
    $countStmt->execute([$appId]);
    $currentReviews = (int)$countStmt->fetchColumn();
    
    if ($currentReviews >= $app['tester_limit']) {
        // Sécurité supplémentaire si le statut n'était pas mis à jour
        $updateStmt = $pdo->prepare("UPDATE applications SET status = 'completed' WHERE id = ?");
        $updateStmt->execute([$appId]);
        
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'La limite de testeurs pour cette application a été atteinte.']);
        exit;
    }
    
    // 6. Insérer le rapport de test
    $insertStmt = $pdo->prepare("
        INSERT INTO test_reviews (app_id, tester_id, rating, feedback, bugs_found, device_info)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $insertStmt->execute([$appId, $testerId, $rating, $feedback, $bugsFound, $deviceInfo]);
    
    // 7. Vérifier si on doit clore l'application suite à cette soumission
    $newReviewsCount = $currentReviews + 1;
    if ($newReviewsCount >= $app['tester_limit']) {
        $updateStmt = $pdo->prepare("UPDATE applications SET status = 'completed' WHERE id = ?");
        $updateStmt->execute([$appId]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Rapport de test soumis avec succès !'
    ]);
    
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la soumission du rapport : ' . $e->getMessage()
    ]);
}
