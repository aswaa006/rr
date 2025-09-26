const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const router = express.Router();

const db = new Database(path.join(__dirname, '..', 'D:/campus-hero-rides-main/database.db'));

const authMiddleware = require('./admin').authMiddleware; // Use the auth middleware

// Get all hero applications (protected route)
router.get('/', authMiddleware, (req, res) => {
  const apps = db.prepare('SELECT * FROM heroApplications').all();
  res.json(apps);
});

// Update application status (protected route)
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const stmt = db.prepare('UPDATE heroApplications SET status = ? WHERE id = ?');
  const info = stmt.run(status, id);
  if (info.changes === 0) return res.status(404).json({ message: 'Application not found' });
  res.json({ message: 'Status updated' });
});

module.exports = router;
