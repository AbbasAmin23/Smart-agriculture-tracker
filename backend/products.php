<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// Only admins can modify products
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SESSION['role'] !== 'Admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Permission denied']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdoconnection->prepare('SELECT * FROM products');
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $stmt = $pdoconnection->prepare('INSERT INTO products (name) VALUES (?)');
    if ($stmt->execute([$name])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add product']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $pdoconnection->prepare('DELETE FROM products WHERE id = ?');
    if ($stmt->execute([$id])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete product']);
    }
}
?>