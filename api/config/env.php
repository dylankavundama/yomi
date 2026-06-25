<?php
// api/config/env.php
// Ne commitez jamais ce fichier dans le contrôle de version (ajoutez-le à .gitignore)

return [
    'DB_HOST' => '127.0.0.1',
    'DB_NAME' => 'yomitest_db',
    'DB_USER' => 'root',
    'DB_PASS' => '',
    'ALLOWED_ORIGINS' => [
        'http://localhost:5173',
        'http://localhost:5174',
        // Ajoutez votre domaine de production ici, ex: 'https://votre-domaine.com'
    ]
];
