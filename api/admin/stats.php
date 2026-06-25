<?php
// api/admin/stats.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez GET.']);
    exit;
}

// Vérifier l'authentification et le rôle admin
$user = getAuthenticatedUser($pdo);
if (($user['role'] ?? 'user') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Accès refusé. Rôle administrateur requis.']);
    exit;
}

$period = $_GET['period'] ?? 'all';
$month = isset($_GET['month']) && $_GET['month'] !== '' ? $_GET['month'] : null;
$year = isset($_GET['year']) && $_GET['year'] !== '' ? $_GET['year'] : null;

$startDate = null;
$endDate = null;

if ($month && $year) {
    // Si filtré par mois et année spécifiques
    $monthVal = str_pad((int)$month, 2, '0', STR_PAD_LEFT);
    $yearVal = (int)$year;
    
    $startDate = "{$yearVal}-{$monthVal}-01 00:00:00";
    $endDate = date('Y-m-t 23:59:59', strtotime($startDate));
    $period = 'custom_month';
} else {
    // Sinon, comportement par défaut basé sur period
    $endDate = date('Y-m-d H:i:s');
    switch ($period) {
        case 'day':
            $startDate = date('Y-m-d H:i:s', strtotime('-24 hours'));
            break;
        case 'month':
            $startDate = date('Y-m-d H:i:s', strtotime('-30 days'));
            break;
        case 'year':
            $startDate = date('Y-m-d H:i:s', strtotime('-365 days'));
            break;
        case 'all':
        default:
            $startDate = '1970-01-01 00:00:00';
            break;
    }
}

try {
    // 1. Statistiques Périodiques
    // Nouveaux utilisateurs
    $usersStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE created_at BETWEEN ? AND ?");
    $usersStmt->execute([$startDate, $endDate]);
    $newUsers = (int)$usersStmt->fetchColumn();

    // Nouvelles applications
    $appsStmt = $pdo->prepare("SELECT COUNT(*) FROM applications WHERE created_at BETWEEN ? AND ?");
    $appsStmt->execute([$startDate, $endDate]);
    $newApps = (int)$appsStmt->fetchColumn();

    // Nouveaux rapports de test
    $reviewsStmt = $pdo->prepare("SELECT COUNT(*) FROM test_reviews WHERE created_at BETWEEN ? AND ?");
    $reviewsStmt->execute([$startDate, $endDate]);
    $newReviews = (int)$reviewsStmt->fetchColumn();

    // Mails d'invitation envoyés
    $emailsStmt = $pdo->prepare("SELECT SUM(emails_sent) FROM applications WHERE created_at BETWEEN ? AND ?");
    $emailsStmt->execute([$startDate, $endDate]);
    $emailsSent = (int)$emailsStmt->fetchColumn();

    // Clics enregistrés
    $clicksStmt = $pdo->prepare("SELECT SUM(clicks_count) FROM applications WHERE created_at BETWEEN ? AND ?");
    $clicksStmt->execute([$startDate, $endDate]);
    $clicksCount = (int)$clicksStmt->fetchColumn();

    // Nombre de visiteurs (page_views)
    $visitorsStmt = $pdo->prepare("SELECT COUNT(*) FROM page_views WHERE created_at BETWEEN ? AND ?");
    $visitorsStmt->execute([$startDate, $endDate]);
    $visitorsCount = (int)$visitorsStmt->fetchColumn();

    // 2. Évolution temporelle (Tendances pour les graphiques)
    $trendUsers = [];
    $trendApps = [];
    $trendReviews = [];
    $trendVisitors = [];

    if ($period === 'day') {
        // Stats par heure sur les dernières 24 heures
        $stmt = $pdo->prepare("
            SELECT HOUR(created_at) as label, COUNT(*) as count 
            FROM users 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY HOUR(created_at) 
            ORDER BY HOUR(created_at)
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendUsers = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT HOUR(created_at) as label, COUNT(*) as count 
            FROM applications 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY HOUR(created_at) 
            ORDER BY HOUR(created_at)
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendApps = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT HOUR(created_at) as label, COUNT(*) as count 
            FROM test_reviews 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY HOUR(created_at) 
            ORDER BY HOUR(created_at)
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendReviews = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT HOUR(created_at) as label, COUNT(*) as count 
            FROM page_views 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY HOUR(created_at) 
            ORDER BY HOUR(created_at)
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendVisitors = $stmt->fetchAll();
    } elseif ($period === 'month' || $period === 'custom_month') {
        // Stats par jour sur les 30 derniers jours ou le mois sélectionné
        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%d/%m') as label, COUNT(*) as count 
            FROM users 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE(created_at) 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendUsers = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%d/%m') as label, COUNT(*) as count 
            FROM applications 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE(created_at) 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendApps = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%d/%m') as label, COUNT(*) as count 
            FROM test_reviews 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE(created_at) 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendReviews = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%d/%m') as label, COUNT(*) as count 
            FROM page_views 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE(created_at) 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendVisitors = $stmt->fetchAll();
    } else {
        // Stats par mois sur l'année ou tout le temps
        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%m/%y') as label, COUNT(*) as count 
            FROM users 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE_FORMAT(created_at, '%y-%m') 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendUsers = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%m/%y') as label, COUNT(*) as count 
            FROM applications 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE_FORMAT(created_at, '%y-%m') 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendApps = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%m/%y') as label, COUNT(*) as count 
            FROM test_reviews 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE_FORMAT(created_at, '%y-%m') 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendReviews = $stmt->fetchAll();

        $stmt = $pdo->prepare("
            SELECT DATE_FORMAT(created_at, '%m/%y') as label, COUNT(*) as count 
            FROM page_views 
            WHERE created_at BETWEEN ? AND ? 
            GROUP BY DATE_FORMAT(created_at, '%y-%m') 
            ORDER BY created_at
        ");
        $stmt->execute([$startDate, $endDate]);
        $trendVisitors = $stmt->fetchAll();
    }

    echo json_encode([
        'success' => true,
        'period' => $period,
        'stats' => [
            'new_users' => $newUsers,
            'new_apps' => $newApps,
            'new_reviews' => $newReviews,
            'emails_sent' => $emailsSent,
            'clicks_count' => $clicksCount,
            'visitors' => $visitorsCount
        ],
        'trends' => [
            'users' => $trendUsers,
            'apps' => $trendApps,
            'reviews' => $trendReviews,
            'visitors' => $trendVisitors
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors du calcul des statistiques : ' . $e->getMessage()
    ]);
}
