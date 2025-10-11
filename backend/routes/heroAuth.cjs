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

const SECRET_KEY = '4dj8$7!jYt@Lm#Pq9zWxC2RmUvBhY*Gf';

// Hero registration
router.post('/register', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = db.prepare('SELECT id FROM Heroes WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO Heroes (email, password_hash) VALUES (?, ?)');
    const result = stmt.run(email, hash);

    return res.status(201).json({ id: result.lastInsertRowid, email });
  } catch (err) {
    console.error('Hero register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Hero login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const hero = db.prepare('SELECT * FROM Heroes WHERE email = ?').get(email);
    if (!hero) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, hero.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ heroId: hero.id, email: hero.email }, SECRET_KEY, { expiresIn: '12h' });
    return res.json({ token, hero: { id: hero.id, email: hero.email } });
  } catch (err) {
    console.error('Hero login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


