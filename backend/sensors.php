<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit('User not logged in');
}

$user_id = $_SESSION['user_id']; // Assuming sensors are linked to users

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdoconnection->prepare('SELECT * FROM sensors WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $sensors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($sensors);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $type = $_POST['type'];
    $location = $_POST['location'];

    $stmt = $pdoconnection->prepare('INSERT INTO sensors (user_id, name, type, location) VALUES (?, ?, ?, ?)');
    if ($stmt->execute([$user_id, $name, $type, $location])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add sensor']);
    }
}
?>