<?php
session_start();
require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$sql = "SELECT id, name, email, password, role, language FROM users WHERE email = ?";

if($stmt = mysqli_prepare($link, $sql)){
    mysqli_stmt_bind_param($stmt, "s", $email);
    
    if(mysqli_stmt_execute($stmt)){
        mysqli_stmt_store_result($stmt);
        
        if(mysqli_stmt_num_rows($stmt) == 1){
            mysqli_stmt_bind_result($stmt, $id, $name, $email, $hashed_password, $role, $language);
            if(mysqli_stmt_fetch($stmt)){
                if(password_verify($password, $hashed_password)){
                    $_SESSION["loggedin"] = true;
                    $_SESSION["id"] = $id;
                    $_SESSION["name"] = $name;
                    $_SESSION["role"] = $role;
                    $_SESSION["language"] = $language;

                    echo json_encode([
                        "message" => "Successful login.",
                        "email" => $email,
                        "role" => $role,
                        "language" => $language
                    ]);
                } else{
                    echo json_encode(["message" => "Invalid password."]);
                }
            }
        } else{
            echo json_encode(["message" => "Invalid email."]);
        }
    } else{
        echo json_encode(["message" => "Something went wrong. Please try again later."]);
    }

    mysqli_stmt_close($stmt);
}

mysqli_close($link);
?>