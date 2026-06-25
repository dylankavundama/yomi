<?php
// api/config/cors.php

$env = require __DIR__ . '/env.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $env['ALLOWED_ORIGINS'])) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Si l'origine n'est pas autorisée, on peut par défaut autoriser le localhost 5173
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Si c'est une requête de pré-vérification (preflight), on arrête ici avec un code 200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Définir le type de contenu de retour par défaut en JSON
header('Content-Type: application/json');
