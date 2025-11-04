<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit('User not logged in');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sensor_id = $_GET['sensor_id'];
    $crop_id = $_GET['crop_id'];

    $stmt = $pdoconnection->prepare('SELECT * FROM sensor_data WHERE sensor_id = ? AND crop_id = ? ORDER BY timestamp DESC LIMIT 100'); // Limit for performance
    $stmt->execute([$sensor_id, $crop_id]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

// In a real application, you'd have a separate script for devices to POST data.
// For simulation, we can add a POST endpoint here for manual data entry if needed.

?>