const API_URL = 'http://localhost:3000/posts';

// Elements
const postForm = document.getElementById('postForm');
const usernameInput = document.getElementById('username');
const contentInput = document.getElementById('content');
const imageUpload = document.getElementById('imageUpload');
const postsList = document.getElementById('postsList');
const submitBtn = document.getElementById('submitBtn');

// Load posts initially
document.addEventListener('DOMContentLoaded', fetchPosts);

// Handle form submission
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const content = contentInput.value.trim();
    
    if (username && content) {
        // Simple loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        try {
            await createPost();
            // Clear form
            usernameInput.value = '';
            contentInput.value = '';
            imageUpload.value = '';
            // Refresh posts instantly
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Is the server running?');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Message';
        }
    }
});

// Fetch all posts from backend
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderPosts(data.posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        postsList.innerHTML = `<p class="no-posts">⚠️ Could not load posts. Ensure backend server is running.</p>`;
    }
}

// Create a new post
async function createPost() {
    const formData = new FormData(postForm);
    // Since our inputs might not have 'name' attributes (only IDs), let's build FormData manually
    const data = new FormData();
    data.append('username', usernameInput.value.trim());
    data.append('content', contentInput.value.trim());
    if (imageUpload.files[0]) {
        data.append('image', imageUpload.files[0]);
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        // Note: Do not set Content-Type header with FormData, fetch sets it with boundary
        body: data
    });

    if (!response.ok) {
        throw new Error('Failed to post');
    }
}

// Delete a post
async function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh list
                fetchPosts();
            } else {
                alert('Failed to delete the post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}

// Render posts to the UI
function renderPosts(posts) {
    postsList.innerHTML = '';

    if (!posts || posts.length === 0) {
        postsList.innerHTML = `
            <div class="no-posts">
                <p>No posts yet. Be the first to share your thoughts!</p>
            </div>
        `;
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        // Check if image exists
        const imageHtml = post.image_url 
            ? `<div class="post-image-container"><img src="${post.image_url}" class="post-image" alt="Post Image"></div>` 
            : '';

        postCard.innerHTML = `
            <div class="post-header">
                <span class="post-author">${escapeHTML(post.username)}</span>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
            </div>
            <div class="post-content">${escapeHTML(post.content)}</div>
            ${imageHtml}
        `;

        postsList.appendChild(postCard);
    });
}

// Helper function to prevent XSS (Cross-Site Scripting)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}
