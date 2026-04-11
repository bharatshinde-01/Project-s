<?php
/**
 * Login Process Handler
 * Validates admin credentials and creates session
 */

// Start session for managing login state
session_start();

// Include database connection
require_once 'db.php';

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: login.php");
    exit();
}

// Get and sanitize input
$username = isset($_POST['username']) ? mysqli_real_escape_string($conn, trim($_POST['username'])) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validate input
if (empty($username) || empty($password)) {
    $_SESSION['login_error'] = "Please enter both username and password.";
    header("Location: login.php");
    exit();
}

// Query database for admin user
$sql = "SELECT id, username, password FROM admin WHERE username = '$username' LIMIT 1";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) === 1) {
    $admin = mysqli_fetch_assoc($result);
    
    // Verify password
    // Note: For production, use password_hash() and password_verify()
    // This simple comparison is for demo purposes
    if ($password === $admin['password']) {
        // Login successful - create session
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['login_time'] = time();
        
        // Redirect to admin dashboard
        header("Location: admin.php");
        exit();
    } else {
        // Wrong password
        $_SESSION['login_error'] = "Invalid username or password.";
        header("Location: login.php");
        exit();
    }
} else {
    // User not found
    $_SESSION['login_error'] = "Invalid username or password.";
    header("Location: login.php");
    exit();
}

// Close database connection
mysqli_close($conn);
?>
