<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'football_hub');
define('DB_USER', 'admin_user');
define('DB_PASS', 'secure_password');

// Admin credentials (for demo - in production use database)
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', '$2y$10$yourhashedpasswordhere');

// Start session
session_start();

// Create database connection
try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>