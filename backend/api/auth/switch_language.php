<?php
session_start();
require_once '../config/database.php';

if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: /login");
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$language = $data->language;
$user_id = $_SESSION["id"];

$sql = "UPDATE users SET language = ? WHERE id = ?";

if($stmt = mysqli_prepare($link, $sql)){
    mysqli_stmt_bind_param($stmt, "si", $language, $user_id);
    
    if(mysqli_stmt_execute($stmt)){
        $_SESSION["language"] = $language;
        echo json_encode(["message" => "Language was successfully updated."]);
    } else{
        echo json_encode(["message" => "Something went wrong. Please try again later."]);
    }

    mysqli_stmt_close($stmt);
}

mysqli_close($link);
?>