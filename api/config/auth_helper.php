<?php
// api/config/auth_helper.php

require_once __DIR__ . '/db.php';

function getAuthenticatedUser($pdo) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    
    if (!$authHeader) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentification requise. En-tête Authorization manquant.']);
        exit;
    }
    
    // Attendre le format "Bearer <token>"
    if (!preg_match('/Bearer\s+([a-zA-Z0-9]{64})/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Format de jeton invalide ou jeton manquant.']);
        exit;
    }
    
    $token = $matches[1];
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE auth_token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé ou session expirée.']);
            exit;
        }
        
        return $user;
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la vérification de session : ' . $e->getMessage()]);
        exit;
    }
}
