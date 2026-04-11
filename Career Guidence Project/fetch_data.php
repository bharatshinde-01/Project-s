<?php
/**
 * Fetch Student Data API
 * Retrieves all student records for admin panel
 */

// Start session to check admin access
session_start();

// Set headers for JSON response
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Include database connection
require_once 'db.php';

// Check if admin is logged in (optional security check)
// Uncomment below lines to restrict access to logged-in admins only
/*
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized access. Please login as admin."
    ]);
    exit();
}
*/

// Fetch all student records ordered by newest first
$sql = "SELECT id, name, email, stream, interest, suggested_career, created_at 
        FROM students 
        ORDER BY created_at DESC";

$result = mysqli_query($conn, $sql);

if ($result) {
    $students = [];
    
    // Fetch all rows as associative array
    while ($row = mysqli_fetch_assoc($result)) {
        // Format the date for better readability
        $row['formatted_date'] = date('d M Y, h:i A', strtotime($row['created_at']));
        $students[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "count" => count($students),
        "data" => $students
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error fetching data: " . mysqli_error($conn)
    ]);
}

// Close database connection
mysqli_close($conn);
?>
