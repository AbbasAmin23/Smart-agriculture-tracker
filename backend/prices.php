<?php
require_once 'db.php';
require_once 'middleware.php';

if (!is_admin()) {
    die("Access denied");
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $product_id = $_GET['product_id'];
        $sql = "SELECT * FROM prices WHERE product_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $prices = [];
        while ($row = $result->fetch_assoc()) {
            $prices[] = $row;
        }
        echo json_encode($prices);
        $stmt->close();
        break;
    case 'POST':
        $product_id = $_POST['product_id'];
        $price = $_POST['price'];
        $date = $_POST['date'];
        $region = $_POST['region'];

        $sql = "INSERT INTO prices (product_id, price, date, region) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("idss", $product_id, $price, $date, $region);

        if ($stmt->execute()) {
            echo "Price created successfully";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        break;
    case 'PUT':
        parse_str(file_get_contents("php://input"), $_PUT);
        $id = $_PUT['id'];
        $price = $_PUT['price'];
        $date = $_PUT['date'];
        $region = $_PUT['region'];

        $sql = "UPDATE prices SET price = ?, date = ?, region = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("dssi", $price, $date, $region, $id);

        if ($stmt->execute()) {
            echo "Price updated successfully";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        break;
    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'];
        $sql = "DELETE FROM prices WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo "Price deleted successfully";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        break;
}

$conn->close();
?>