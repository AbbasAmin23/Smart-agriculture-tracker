<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['product_id'])) {
        // Get last 7 days of prices for a specific product
        $product_id = $_GET['product_id'];
        $stmt = $pdoconnection->prepare('SELECT price, date FROM prices WHERE product_id = ? AND date >= CURDATE() - INTERVAL 7 DAY ORDER BY date ASC');
        $stmt->execute([$product_id]);
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($prices);
    } else {
        // Get all current prices
        $stmt = $pdoconnection->prepare('SELECT p.id as product_id, p.name AS product_name, pr.price, pr.date, pr.region FROM prices pr JOIN products p ON pr.product_id = p.id ORDER BY pr.date DESC');
        $stmt->execute();
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($prices);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Only admins can add prices
    if ($_SESSION['role'] !== 'Admin') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Permission denied']);
        exit;
    }

    $product_name = $_POST['product_name'];
    $price = $_POST['price'];
    $date = $_POST['date'];
    $region = $_POST['region'];

    // Find product_id from product_name
    $stmt = $pdoconnection->prepare('SELECT id FROM products WHERE name = ?');
    $stmt->execute([$product_name]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        $product_id = $product['id'];
        $stmt = $pdoconnection->prepare('INSERT INTO prices (product_id, price, date, region) VALUES (?, ?, ?, ?)');
        if ($stmt->execute([$product_id, $price, $date, $region])) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add price']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
    }
}
?>