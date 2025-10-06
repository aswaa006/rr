const express = require('express');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const path = require('path');

const router = express.Router();

// Resolve DB path relative to repo root for portability
const repoRoot = path.resolve(__dirname, '..', '..');
const dbPath = path.resolve(repoRoot, 'database.db');
const db = new Database(dbPath);

const SECRET_KEY = '4dj8$7!jYt@Lm#Pq9zWxC2RmUvBhY*Gf';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Fetch all hero applications
router.get('/', verifyToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, name, phone, vehicle_type, vehicle_number, license_url, agreed, status, submitted_at
      FROM HeroApplications
      ORDER BY submitted_at DESC
    `).all();
    res.json(rows);
  } catch (err) {
    console.error('Fetch applications error:', err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Update application status
router.patch('/:id/status', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const stmt = db.prepare(`
      UPDATE HeroApplications
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(status, id);
    if (result.changes === 0) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

module.exports = router;


