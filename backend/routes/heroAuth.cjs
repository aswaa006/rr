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

const SECRET_KEY = '4dj8$7!jYt@Lm#Pq9zWxC2RmUvBhY*Gf';

// Hero registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await dbQuery('SELECT id FROM Heroes WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Email already registered' });

    const hash = bcrypt.hashSync(password, 10);
    const result = await dbRun('INSERT INTO Heroes (email, password_hash) VALUES (?, ?)', [email, hash]);

    return res.status(201).json({ id: result.lastID, email });
  } catch (err) {
    console.error('Hero register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Hero login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const heroes = await dbQuery('SELECT * FROM Heroes WHERE email = ?', [email]);
    const hero = heroes[0];
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


