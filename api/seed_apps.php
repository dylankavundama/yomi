<?php
require_once __DIR__ . '/config/db.php';

try {
    // Check if there is a dev user
    $stmt = $pdo->query("SELECT id FROM users LIMIT 1");
    $user = $stmt->fetch();
    
    if (!$user) {
        // Create a mock developer
        $stmt = $pdo->prepare("INSERT INTO users (google_id, email, name, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['seed_dev_1', 'seed_dev@example.com', 'Seed Developer', 'developer']);
        $userId = $pdo->lastInsertId();
    } else {
        $userId = $user['id'];
    }

    $apps = [
        [
            'name' => 'EcoTrack Pro',
            'description' => 'Application de suivi de l\'empreinte carbone personnelle et recommandations écologiques journalières.',
            'platform' => 'Mobile (iOS/Android)',
            'link' => 'https://example.com/ecotrack',
            'required_testers' => 50
        ],
        [
            'name' => 'TaskFlow AI',
            'description' => 'Gestionnaire de tâches intelligent qui priorise automatiquement votre travail en fonction de vos habitudes.',
            'platform' => 'Web App',
            'link' => 'https://example.com/taskflow',
            'required_testers' => 20
        ],
        [
            'name' => 'NutriScan',
            'description' => 'Scannez vos aliments pour obtenir un profil nutritionnel détaillé et des alertes sur les allergènes.',
            'platform' => 'Android',
            'link' => 'https://example.com/nutriscan',
            'required_testers' => 100
        ]
    ];

    $stmt = $pdo->prepare("INSERT INTO applications (user_id, name, description, platform, link, required_testers, status) VALUES (?, ?, ?, ?, ?, ?, 'active')");

    foreach ($apps as $app) {
        $stmt->execute([
            $userId,
            $app['name'],
            $app['description'],
            $app['platform'],
            $app['link'],
            $app['required_testers']
        ]);
        echo "App added: {$app['name']}\n";
    }

    echo "Successfully seeded 3 applications.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
