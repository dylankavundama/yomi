<?php
// api/apps/track.php

require_once __DIR__ . '/../config/db.php';

// Attendre uniquement des requêtes GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo "Méthode non autorisée. Utilisez GET.";
    exit;
}

$appId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($appId <= 0) {
    http_response_code(400);
    echo "ID d'application invalide.";
    exit;
}

try {
    // Récupérer l'application pour avoir l'URL de redirection
    $stmt = $pdo->prepare("SELECT app_url FROM applications WHERE id = ?");
    $stmt->execute([$appId]);
    $app = $stmt->fetch();
    
    if (!$app) {
        http_response_code(404);
        echo "Application introuvable.";
        exit;
    }
    
    // Incrémenter le compteur de clics
    $updateStmt = $pdo->prepare("UPDATE applications SET clicks_count = clicks_count + 1 WHERE id = ?");
    $updateStmt->execute([$appId]);
    
    // Redirection HTTP 302 vers le frontend Yomitest avec l'ID du projet pour saisie du commentaire
    header("Location: http://localhost:5173/?test_app_id=" . $appId);
    exit;
} catch (\PDOException $e) {
    http_response_code(500);
    echo "Erreur serveur : " . $e->getMessage();
    exit;
}
