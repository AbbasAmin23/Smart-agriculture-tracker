<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
session_start();

require_once '../config/database.php';
require_once '../config/translations.php';

$lang = isset($_SESSION["language"]) ? $_SESSION["language"] : 'ur';

$sql = "SELECT id, name, price, description, image FROM products";
$result = mysqli_query($link, $sql);

$products_arr = array();
$products_arr["records"] = array();

while ($row = mysqli_fetch_assoc($result)){
    extract($row);
    $product_item = array(
        "id" => $id,
        "name" => $name,
        "price" => $price,
        "description" => $description,
        "image" => $image
    );
    array_push($products_arr["records"], $product_item);
}

$products_arr['translations'] = $translations[$lang];

echo json_encode($products_arr);

mysqli_close($link);
?>