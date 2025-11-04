<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $productId = $_GET['product_id'];
        $stmt = $pdo->prepare('SELECT * FROM prices WHERE product_id = ?');
        $stmt->execute([$productId]);
        echo json_encode($stmt->fetchAll());
        break;
    case 'POST':
        $productId = $_POST['product_id'];
        $price = $_POST['price'];
        $date = $_POST['date'];
        $region = $_POST['region'];
        $stmt = $pdo->prepare('INSERT INTO prices (product_id, price, date, region) VALUES (?, ?, ?, ?)');
        $stmt->execute([$productId, $price, $date, $region]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'product_id' => $productId, 'price' => $price, 'date' => $date, 'region' => $region]);
        break;
    case 'DELETE':
        parse_str(file_get_contents('php://input'), $_DELETE);
        $id = $_DELETE['id'];
        $stmt = $pdo->prepare('DELETE FROM prices WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
        break;
}
?>