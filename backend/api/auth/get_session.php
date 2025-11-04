<?php
header("Content-Type: application/json; charset=UTF-8");
session_start();

if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    echo json_encode(["loggedin" => true, "username" => $_SESSION["username"], "language" => $_SESSION["language"]]);
} else {
    echo json_encode(["loggedin" => false]);
}
?>