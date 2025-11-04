<?php
header("Content-Type: application/json; charset=UTF-8");
session_start();

$data = json_decode(file_get_contents("php://input"));

if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true && isset($data->language)) {
    $_SESSION["language"] = $data->language;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}
?>