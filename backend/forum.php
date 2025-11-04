<?php
require_once 'db.php';

session_start();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT p.id, p.title, p.content, p.created_at, u.username FROM forum_posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
        echo json_encode($stmt->fetchAll());
        break;
    case 'POST':
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'You must be logged in to create a post.']);
            exit();
        }
        $title = $_POST['title'];
        $content = $_POST['content'];
        $userId = $_SESSION['user_id'];

        $stmt = $pdo->prepare('INSERT INTO forum_posts (user_id, title, content) VALUES (?, ?, ?)');
        $stmt->execute([$userId, $title, $content]);
        echo json_encode(['status' => 'success']);
        break;
}
?>