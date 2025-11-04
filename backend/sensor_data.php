<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['crop_id'])) {
        $stmt = $pdoconnection->prepare('SELECT * FROM sensor_data WHERE crop_id = ?');
        $stmt->execute([$_GET['crop_id']]);
        $sensor_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($sensor_data);
    } else {
        $stmt = $pdoconnection->prepare('SELECT * FROM sensor_data');
        $stmt->execute();
        $sensor_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($sensor_data);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sensor_id = $_POST['sensor_id'];
    $crop_id = $_POST['crop_id'];
    $value = $_POST['value'];

    $stmt = $pdoconnection->prepare('INSERT INTO sensor_data (sensor_id, crop_id, value) VALUES (?, ?, ?)');
    if ($stmt->execute([$sensor_id, $crop_id, $value])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add sensor data']);
    }
}
?>