<?php
/**
 * Save Student Data API
 * Accepts POST data and stores in students table
 */

// Set headers for JSON response and CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
    exit();
}

// Get POST data (supports both form data and JSON)
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? $_SERVER["CONTENT_TYPE"] : '';

if (strpos($contentType, 'application/json') !== false) {
    // JSON input
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
} else {
    // Form data input
    $data = $_POST;
}

// Extract and sanitize data
$name = isset($data['name']) ? mysqli_real_escape_string($conn, trim($data['name'])) : '';
$email = isset($data['email']) ? mysqli_real_escape_string($conn, trim($data['email'])) : '';
$stream = isset($data['stream']) ? mysqli_real_escape_string($conn, trim($data['stream'])) : '';
$interest = isset($data['interest']) ? mysqli_real_escape_string($conn, trim($data['interest'])) : '';
$suggested_career = isset($data['suggested_career']) ? mysqli_real_escape_string($conn, trim($data['suggested_career'])) : '';

// Validate required fields
if (empty($name) || empty($stream) || empty($interest) || empty($suggested_career)) {
    echo json_encode([
        "success" => false,
        "message" => "Please fill all required fields (name, stream, interest, suggested career)"
    ]);
    exit();
}

// Prepare and execute INSERT query
$sql = "INSERT INTO students (name, email, stream, interest, suggested_career) 
        VALUES ('$name', '$email', '$stream', '$interest', '$suggested_career')";

if (mysqli_query($conn, $sql)) {
    echo json_encode([
        "success" => true,
        "message" => "Data saved successfully!",
        "id" => mysqli_insert_id($conn)
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error saving data: " . mysqli_error($conn)
    ]);
}

// Close database connection
mysqli_close($conn);
?>
