
document.addEventListener('DOMContentLoaded', () => {
    let translations = {};

    const fetchSessionAndPosts = async () => {
        try {
            const sessionResponse = await fetch('/backend/api/auth/get_session.php');
            const sessionData = await sessionResponse.json();

            if (!sessionData.loggedin) {
                window.location.href = 'login.html';
                return;
            }

            const lang = sessionData.language || 'ur'; // Default to Urdu if no language is set
            document.getElementById('language-switcher').value = lang;

            const postsResponse = await fetch('/backend/api/forum/get_posts.php');
            const postsData = await postsResponse.json();
            translations = postsData.translations;
            displayPosts(postsData.posts);
            updateUI(lang);
        } catch (error) {
            console.error('Error fetching session or posts:', error);
        }
    };

    fetchSessionAndPosts();

    document.getElementById('new-post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        if (title && content) {
            try {
                const response = await fetch('/backend/api/forum/create_post.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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

    document.getElementById('language-switcher').addEventListener('change', async (e) => {
        const newLang = e.target.value;
        try {
            const response = await fetch('/backend/api/auth/switch_language.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: newLang })
            });

            if (response.ok) {
                updateUI(newLang);
            } else {
                console.error('Failed to switch language');
            }
        } catch (error) {
            console.error('Error switching language:', error);
        }
    });

    function updateUI(lang) {
        document.getElementById('forum-title').textContent = translations.forum_title;
        document.getElementById('create-post-title').textContent = translations.create_new_post;
        document.getElementById('post-title-label').textContent = translations.title;
        document.getElementById('post-content-label').textContent = translations.content;
        document.getElementById('post-button').textContent = translations.post;
        document.getElementById('recent-posts-title').textContent = translations.recent_posts;
    }
});

async function fetchPosts() {
    try {
        const response = await fetch('/backend/api/forum/get_posts.php');
        const data = await response.json();
        displayPosts(data.posts);
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
