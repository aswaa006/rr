const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Database path
const dbPath = path.join(__dirname, '..', 'database.db');

// Create prebook table if it doesn't exist
const initPrebookTable = () => {
  const db = new sqlite3.Database(dbPath);
  db.run(`
    CREATE TABLE IF NOT EXISTS prebook_rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      pickup TEXT NOT NULL,
      drop_location TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      scheduled_datetime TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating prebook_rides table:', err);
    } else {
      console.log('Prebook rides table ready');
    }
  });
  db.close();
};

// Initialize table on startup
initPrebookTable();

// POST /api/prebook - Create a new pre-booking
router.post('/', (req, res) => {
  const { username, pickup, drop, date, time, scheduledDateTime } = req.body;

  if (!username || !pickup || !drop || !date || !time || !scheduledDateTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = new sqlite3.Database(dbPath);
  const sql = `
    INSERT INTO prebook_rides (username, pickup, drop_location, scheduled_date, scheduled_time, scheduled_datetime)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [username, pickup, drop, date, time, scheduledDateTime], function(err) {
    if (err) {
      console.error('Error inserting prebook ride:', err);
      res.status(500).json({ error: 'Failed to create pre-booking' });
    } else {
      res.json({ 
        success: true, 
        id: this.lastID,
        message: 'Pre-booking created successfully' 
      });
    }
    db.close();
  });
});

// GET /api/prebook - Get all pre-bookings (for admin)
router.get('/', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const sql = `
    SELECT id, username, pickup, drop_location, scheduled_date, scheduled_time, scheduled_datetime, created_at, status
    FROM prebook_rides
    ORDER BY scheduled_datetime ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching prebook rides:', err);
      res.status(500).json({ error: 'Failed to fetch pre-bookings' });
    } else {
      res.json(rows);
    }
    db.close();
  });
});

// PUT /api/prebook/:id/status - Update pre-booking status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = new sqlite3.Database(dbPath);
  const sql = 'UPDATE prebook_rides SET status = ? WHERE id = ?';

  db.run(sql, [status, id], function(err) {
    if (err) {
      console.error('Error updating prebook status:', err);
      res.status(500).json({ error: 'Failed to update status' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Pre-booking not found' });
    } else {
      res.json({ success: true, message: 'Status updated successfully' });
    }
    db.close();
  });
});

// DELETE /api/prebook/:id - Delete a pre-booking
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = new sqlite3.Database(dbPath);
  const sql = 'DELETE FROM prebook_rides WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      console.error('Error deleting prebook ride:', err);
      res.status(500).json({ error: 'Failed to delete pre-booking' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Pre-booking not found' });
    } else {
      res.json({ success: true, message: 'Pre-booking deleted successfully' });
    }
    db.close();
  });
});

module.exports = router;
