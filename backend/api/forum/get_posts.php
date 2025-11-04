<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
session_start();

require_once '../config/database.php';
require_once '../config/translations.php';

$lang = isset($_SESSION["language"]) ? $_SESSION["language"] : 'ur';

$sql = "SELECT p.id, p.title, p.content, u.name as author, p.created_at FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC";
$result = mysqli_query($link, $sql);

$posts_arr = array();

while ($row = mysqli_fetch_assoc($result)){
    extract($row);
    $post_item = array(
        "id" => $id,
        "title" => $title,
        "content" => $content,
        "author" => $author,
        "date" => $created_at
    );
    array_push($posts_arr, $post_item);
}

$response = [
    'posts' => $posts_arr,
    'translations' => $translations[$lang]
];

echo json_encode($response);

mysqli_close($link);
?>