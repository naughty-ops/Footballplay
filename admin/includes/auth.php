<?php
function is_logged_in() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function authenticate($username, $password) {
    // In production, use password_hash() and password_verify()
    $valid_username = 'admin'; // Change this
    $valid_password_hash = '$2y$10$yourhashedpasswordhere'; // Generated with password_hash()
    
    // For demo purposes only - never store passwords in code!
    $demo_password = 'FootballHub2023!';
    
    if ($username === $valid_username && password_verify($demo_password, $valid_password_hash)) {
        return true;
    }
    
    return false;
}

function require_login() {
    if (!is_logged_in()) {
        header('Location: index.php');
        exit();
    }
}

function logout() {
    $_SESSION = array();
    session_destroy();
    header('Location: index.php');
    exit();
}
?>