<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$email = $data->email;
$password = $data->password;
$role = $data->role;

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

if($stmt = mysqli_prepare($link, $sql)){
    mysqli_stmt_bind_param($stmt, "ssss", $name, $email, $password_hash, $role);
    
    if(mysqli_stmt_execute($stmt)){
        echo json_encode(["message" => "User was successfully registered."]);
    } else{
        echo json_encode(["message" => "Something went wrong. Please try again later."]);
    }

    mysqli_stmt_close($stmt);
}

mysqli_close($link);
?>