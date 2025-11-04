
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if not authenticated
        // For now, we'll allow anonymous access to the forum
    }

    fetchPosts();

    document.getElementById('new-post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        if (title && content) {
            try {
                const response = await fetch('/api/forum/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, content })
                });

                if (response.ok) {
                    fetchPosts();
                    document.getElementById('new-post-form').reset();
                } else {
                    console.error('Failed to create post');
                }
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
    });
});

async function fetchPosts() {
    try {
        const response = await fetch('/api/forum/posts');
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function displayPosts(posts) {
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = '<h3>Recent Posts</h3>'; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <div class="post-meta">By ${post.author} on ${new Date(post.date).toLocaleDateString()}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}
