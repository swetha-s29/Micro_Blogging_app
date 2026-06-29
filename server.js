const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configure Multer
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Auto create database/table if not exists
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT
        )`, (err) => {
            if (!err) {
                // If table already existed without image_url, this attempts to add it.
                // We ignore the error if it already exists.
                db.run('ALTER TABLE posts ADD COLUMN image_url TEXT', () => {});
            }
        });
    }
});

// RESTful APIs

// 1. GET /posts -> Get all posts
app.get('/posts', (req, res) => {
    const query = 'SELECT * FROM posts ORDER BY id DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ posts: rows });
    });
});

// 2. POST /posts -> Create a new post
app.post('/posts', upload.single('image'), (req, res) => {
    const { username, content } = req.body;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
    
    if (!username || !content) {
        res.status(400).json({ error: 'Username and content are required' });
        return;
    }

    const query = 'INSERT INTO posts (username, content, image_url) VALUES (?, ?, ?)';
    db.run(query, [username, content, imageUrl], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Post created successfully',
            post: {
                id: this.lastID,
                username,
                content,
                image_url: imageUrl
            }
        });
    });
});

// 3. DELETE /posts/:id -> Delete a post
app.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    
    const query = 'DELETE FROM posts WHERE id = ?';
    db.run(query, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.json({ message: 'Post deleted successfully', changes: this.changes });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
