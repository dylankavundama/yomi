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
            'title' => 'EcoTrack Pro',
            'description' => 'Application de suivi de l\'empreinte carbone personnelle et recommandations écologiques journalières.',
            'platform' => 'Web',
            'app_url' => 'https://example.com/ecotrack',
            'instructions' => 'Veuillez tester la création d\'un compte et l\'ajout de 3 repas.',
            'tester_limit' => 50
        ],
        [
            'title' => 'TaskFlow AI',
            'description' => 'Gestionnaire de tâches intelligent qui priorise automatiquement votre travail en fonction de vos habitudes.',
            'platform' => 'Web',
            'app_url' => 'https://example.com/taskflow',
            'instructions' => 'Vérifiez la réactivité du glisser-déposer sur mobile.',
            'tester_limit' => 20
        ],
        [
            'title' => 'NutriScan',
            'description' => 'Scannez vos aliments pour obtenir un profil nutritionnel détaillé et des alertes sur les allergènes.',
            'platform' => 'Android',
            'app_url' => 'https://example.com/nutriscan',
            'instructions' => 'Testez la fonctionnalité de scan avec la caméra en faible luminosité.',
            'tester_limit' => 100
        ]
    ];

    $stmt = $pdo->prepare("INSERT INTO applications (user_id, title, description, platform, app_url, instructions, tester_limit, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')");

    foreach ($apps as $app) {
        $stmt->execute([
            $userId,
            $app['title'],
            $app['description'],
            $app['platform'],
            $app['app_url'],
            $app['instructions'],
            $app['tester_limit']
        ]);
        echo "App added: {$app['title']}\n";
    }

    echo "Successfully seeded 3 applications.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
