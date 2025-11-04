<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM products');
        echo json_encode($stmt->fetchAll());
        break;
    case 'POST':
        $name = $_POST['name'];
        $stmt = $pdo->prepare('INSERT INTO products (name) VALUES (?)');
        $stmt->execute([$name]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'name' => $name]);
        break;
    case 'DELETE':
        parse_str(file_get_contents('php://input'), $_DELETE);
        $id = $_DELETE['id'];
        $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
        break;
}
?>