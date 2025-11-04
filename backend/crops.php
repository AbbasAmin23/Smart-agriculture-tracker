<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit('User not logged in');
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdoconnection->prepare('SELECT * FROM crops WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $crops = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($crops);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $planting_date = $_POST['planting_date'];

    $stmt = $pdoconnection->prepare('INSERT INTO crops (user_id, name, planting_date) VALUES (?, ?, ?)');
    if ($stmt->execute([$user_id, $name, $planting_date])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add crop']);
    }
}
?>