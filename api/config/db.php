<?php
// api/config/db.php

$env = require __DIR__ . '/env.php';

$host = $env['DB_HOST'];
$db   = $env['DB_NAME'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     
     // Migration dynamique : s'assurer que la colonne role existe
     $checkColumn = $pdo->query("SHOW COLUMNS FROM users LIKE 'role'");
     if (!$checkColumn->fetch()) {
         $pdo->exec("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'");
     }

     // Migration dynamique : s'assurer que la colonne auth_token existe
     $checkTokenColumn = $pdo->query("SHOW COLUMNS FROM users LIKE 'auth_token'");
     if (!$checkTokenColumn->fetch()) {
         $pdo->exec("ALTER TABLE users ADD COLUMN auth_token VARCHAR(128) DEFAULT NULL UNIQUE");
     }

     // Migration dynamique : s'assurer que la colonne dev_feedback existe dans applications
     $checkFeedbackColumn = $pdo->query("SHOW COLUMNS FROM applications LIKE 'dev_feedback'");
     if (!$checkFeedbackColumn->fetch()) {
         $pdo->exec("ALTER TABLE applications ADD COLUMN dev_feedback TEXT DEFAULT NULL");
     }

     // Migration dynamique : s'assurer que la colonne prod_url existe dans applications
     $checkProdUrlColumn = $pdo->query("SHOW COLUMNS FROM applications LIKE 'prod_url'");
     if (!$checkProdUrlColumn->fetch()) {
         $pdo->exec("ALTER TABLE applications ADD COLUMN prod_url VARCHAR(500) DEFAULT NULL");
     }

     // Migration dynamique : s'assurer que la table platform_feedbacks existe
     $pdo->exec("CREATE TABLE IF NOT EXISTS platform_feedbacks (
         id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL,
         rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
         comment TEXT NOT NULL,
         is_approved TINYINT(1) DEFAULT 0,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB");

     // Migration dynamique : s'assurer que la table page_views existe
     $pdo->exec("CREATE TABLE IF NOT EXISTS page_views (
         id INT AUTO_INCREMENT PRIMARY KEY,
         ip_address VARCHAR(45) DEFAULT NULL,
         user_agent VARCHAR(255) DEFAULT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB");
} catch (\PDOException $e) {
     // En cas d'erreur de connexion, on renvoie une réponse JSON d'erreur
     header('Content-Type: application/json');
     http_response_code(500);
     echo json_encode([
         'success' => false,
         'message' => 'Erreur de connexion à la base de données : ' . $e->getMessage()
     ]);
     exit;
}
