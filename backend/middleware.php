<?php
session_start();

function is_authenticated() {
    return isset($_SESSION['user_id']);
}

function is_admin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

function is_farmer() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'farmer';
}
?>