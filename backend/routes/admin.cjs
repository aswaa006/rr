const express = require('express');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
// Resolve DB path relative to repo root for portability
const repoRoot = path.resolve(__dirname, '..', '..');
const dbPath = path.resolve(repoRoot, 'database.db');
const db = new Database(dbPath);

const SECRET_KEY = '4dj8$7!jYt@Lm#Pq9zWxC2RmUvBhY*Gf'; // Replace with a strong secret key

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM Admins WHERE username = ?').get(username);
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ username: admin.username }, SECRET_KEY, { expiresIn: '1h' });

    // Respond with token and admin info
    res.json({ token, admin: { username: admin.username } });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
