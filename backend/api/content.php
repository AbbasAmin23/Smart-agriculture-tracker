<?php
header("Content-Type: application/json; charset=UTF-8");

$lang = isset($_GET['lang']) ? $_GET['lang'] : 'ur';

$translations = require __DIR__ . '/../config/translations.php';

$response = [];
foreach ($translations as $key => $value) {
    $response[$key] = $value[$lang] ?? $value['en']; // Fallback to English if translation not found
}

echo json_encode($response);
