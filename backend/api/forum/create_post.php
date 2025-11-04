<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$title = $data->title;
$content = $data->content;
$user_id = $data->user_id;

$sql = "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)";

if($stmt = mysqli_prepare($link, $sql)){
    mysqli_stmt_bind_param($stmt, "ssi", $title, $content, $user_id);
    
    if(mysqli_stmt_execute($stmt)){
        echo json_encode(["message" => "Post was successfully created."]);
    } else{
        echo json_encode(["message" => "Something went wrong. Please try again later."]);
    }

    mysqli_stmt_close($stmt);
}

mysqli_close($link);
?>