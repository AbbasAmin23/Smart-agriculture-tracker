<?php
require_once 'db.php';
require_once 'middleware.php';

if (!is_admin()) {
    die("Access denied");
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM products";
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode($products);
        break;
    case 'POST':
        $name = $_POST['name'];
        $sql = "INSERT INTO products (name) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $name);
        if ($stmt->execute()) {
            echo "Product created successfully";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        break;
    case 'PUT':
        parse_str(file_get_contents("php://input"), $_PUT);
        $id = $_PUT['id'];
        $name = $_PUT['name'];
        $sql = "UPDATE products SET name = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $name, $id);
        if ($stmt->execute()) {
            echo "Product updated successfully";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        break;
    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'];
        $sql = "DELETE FROM products WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo "Product deleted successfully";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        break;
}

$conn->close();
?>