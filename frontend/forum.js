const postsDiv = document.getElementById('posts');
const newPostForm = document.getElementById('new-post-form');

function fetchPosts() {
    fetch('../backend/forum.php')
        .then(response => response.json())
        .then(posts => {
            postsDiv.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <p><i>by ${post.username} at ${post.created_at}</i></p>
                    <hr>
                    <h4>Comments</h4>
                    <div id="comments-${post.id}"></div>
                    <form class="comment-form" data-post-id="${post.id}">
                        <textarea name="content" placeholder="Add a comment" required></textarea><br>
                        <button type="submit">Comment</button>
                    </form>
                `;
                postsDiv.appendChild(postElement);
                fetchComments(post.id);
            });
        });
}

function fetchComments(postId) {
    fetch(`../backend/comments.php?post_id=${postId}`)
        .then(response => response.json())
        .then(comments => {
            const commentsDiv = document.getElementById(`comments-${postId}`);
            commentsDiv.innerHTML = '';
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.innerHTML = `
                    <p>${comment.content}</p>
                    <p><i>by ${comment.username} at ${comment.created_at}</i></p>
                `;
                commentsDiv.appendChild(commentElement);
            });
        });
}

newPostForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('../backend/forum.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            newPostForm.reset();
            fetchPosts();
        } else {
            alert(data.message);
        }
    });
});

document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('comment-form')) {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append('post_id', e.target.dataset.postId);

        fetch('../backend/comments.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                e.target.reset();
                fetchComments(e.target.dataset.postId);
            } else {
                alert(data.message);
            }
        });
    }
});

fetchPosts();