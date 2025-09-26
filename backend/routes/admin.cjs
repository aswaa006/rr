const express = require('express');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = new Database('D:/campus-hero-rides-main/database.db');

const SECRET_KEY = '4dj8$7!jYt@Lm#Pq9zWxC2RmUvBhY*Gf'; // Replace with a strong secret key

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM Admins WHERE username = ?').get(username);
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, admin.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ username: admin.username }, SECRET_KEY, { expiresIn: '1h' });

  // Respond with token and admin info
  res.json({ token, admin: { username: admin.username } });
});

module.exports = router;
