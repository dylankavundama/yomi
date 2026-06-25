<?php
// api/track_visitor.php

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/db.php';

// Attendre uniquement des requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

try {
    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;

    // Éviter de logguer les requêtes de bots connus pour garder des stats propres
    if ($ua && preg_match('/bot|crawl|spider|slurp|facebookexternalhit|embedly/i', $ua)) {
        echo json_encode(['success' => true, 'message' => 'Bot ignoré.']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO page_views (ip_address, user_agent) VALUES (?, ?)");
    $stmt->execute([$ip, $ua]);

    echo json_encode(['success' => true, 'message' => 'Visite enregistrée avec succès.']);
} catch (\PDOException $e) {
    // Échouer silencieusement sans bloquer le client
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
