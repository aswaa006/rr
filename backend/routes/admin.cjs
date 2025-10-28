const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
// Resolve DB path relative to repo root for portability
const repoRoot = path.resolve(__dirname, '..', '..');
const dbPath = path.resolve(repoRoot, 'database.db');

// Database helper functions
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.run(sql, params, function(err) {
      db.close();
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const SECRET_KEY = '4dj8$7!jYt@Lm#Pq9zWxC2RmUvBhY*Gf'; // Replace with a strong secret key

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admins = await dbQuery('SELECT * FROM Admins WHERE username = ?', [username]);
    const admin = admins[0];
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
