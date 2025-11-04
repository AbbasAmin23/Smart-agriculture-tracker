<?php
require_once 'db.php';

session_start();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $postId = $_GET['post_id'];
        $stmt = $pdo->prepare('SELECT c.id, c.content, c.created_at, u.username FROM forum_comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC');
        $stmt->execute([$postId]);
        echo json_encode($stmt->fetchAll());
        break;
    case 'POST':
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'You must be logged in to comment.']);
            exit();
        }
        $postId = $_POST['post_id'];
        $content = $_POST['content'];
        $userId = $_SESSION['user_id'];

        $stmt = $pdo->prepare('INSERT INTO forum_comments (post_id, user_id, content) VALUES (?, ?, ?)');
        $stmt->execute([$postId, $userId, $content]);
        echo json_encode(['status' => 'success']);
        break;
}
?>