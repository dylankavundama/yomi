CREATE DATABASE IF NOT EXISTS yomitest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yomitest_db;

-- Table des utilisateurs (Développeurs et Testeurs unifiés)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des applications soumises pour tests
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    platform ENUM('Web', 'Android', 'iOS', 'Windows', 'macOS', 'Linux') NOT NULL,
    app_url VARCHAR(500) NOT NULL,
    instructions TEXT NOT NULL,
    tester_limit INT DEFAULT 5,
    status ENUM('active', 'completed') DEFAULT 'active',
    dev_feedback TEXT DEFAULT NULL,
    prod_url VARCHAR(500) DEFAULT NULL,
    emails_sent INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table des rapports de test soumis par les testeurs
CREATE TABLE IF NOT EXISTS test_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    tester_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    bugs_found TEXT NULL,
    device_info VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (tester_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tester_app (app_id, tester_id)
) ENGINE=InnoDB;

-- Table de suivi des visites
CREATE TABLE IF NOT EXISTS page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
