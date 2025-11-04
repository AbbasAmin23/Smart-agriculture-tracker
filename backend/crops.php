<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdoconnection->prepare('SELECT * FROM crops');
    $stmt->execute();
    $crops = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($crops);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $planting_date = $_POST['planting_date'];
    $harvest_date = $_POST['harvest_date'];

    $stmt = $pdoconnection->prepare('INSERT INTO crops (name, planting_date, harvest_date) VALUES (?, ?, ?)');
    if ($stmt->execute([$name, $planting_date, $harvest_date])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add crop']);
    }
}
?>