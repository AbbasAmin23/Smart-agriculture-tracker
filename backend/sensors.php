<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdoconnection->prepare('SELECT * FROM sensors');
    $stmt->execute();
    $sensors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($sensors);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $type = $_POST['type'];
    $location = $_POST['location'];

    $stmt = $pdoconnection->prepare('INSERT INTO sensors (name, type, location) VALUES (?, ?, ?)');
    if ($stmt->execute([$name, $type, $location])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add sensor']);
    }
}
?>