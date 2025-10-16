const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath);

// Get available ride requests for drivers
router.get('/requests', (req, res) => {
  const query = `
    SELECT 
      r.id,
      u.name as student_name,
      u.phone as student_phone,
      r.pickup_location as from_location,
      r.drop_location as to_location,
      r.fare,
      r.created_at as requested_at,
      r.scheduled_time as expires_at,
      'Male' as gender,
      'Any' as driver_preference
    FROM rides r
    JOIN users u ON r.student_id = u.id
    WHERE r.status = 'requested' 
    AND r.driver_id IS NULL
    AND datetime(r.created_at, '+3 minutes') > datetime('now')
    ORDER BY r.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching ride requests:', err);
      return res.status(500).json({ error: 'Failed to fetch ride requests' });
    }

    // Add time remaining calculation
    const requests = rows.map(row => ({
      ...row,
      timeRemaining: Math.max(0, Math.floor((new Date(row.expires_at).getTime() - new Date().getTime()) / 1000))
    }));

    res.json(requests);
  });
});

// Accept a ride request
router.post('/accept', (req, res) => {
  const { rideId, driverId } = req.body;

  if (!rideId || !driverId) {
    return res.status(400).json({ error: 'Ride ID and Driver ID are required' });
  }

  const query = `
    UPDATE rides 
    SET 
      driver_id = ?,
      status = 'accepted',
      updated_at = datetime('now')
    WHERE id = ? AND status = 'requested'
  `;

  db.run(query, [driverId, rideId], function(err) {
    if (err) {
      console.error('Error accepting ride:', err);
      return res.status(500).json({ error: 'Failed to accept ride' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Ride not found or already accepted' });
    }

    res.json({ success: true, message: 'Ride accepted successfully' });
  });
});

// Decline a ride request
router.post('/decline', (req, res) => {
  const { rideId } = req.body;

  if (!rideId) {
    return res.status(400).json({ error: 'Ride ID is required' });
  }

  const query = `
    UPDATE rides 
    SET 
      status = 'cancelled',
      updated_at = datetime('now')
    WHERE id = ?
  `;

  db.run(query, [rideId], function(err) {
    if (err) {
      console.error('Error declining ride:', err);
      return res.status(500).json({ error: 'Failed to decline ride' });
    }

    res.json({ success: true, message: 'Ride declined successfully' });
  });
});

// Update ride status (OTP verified, started, completed)
router.put('/:rideId/status', (req, res) => {
  const { rideId } = req.params;
  const { status, otp } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  let query = '';
  let params = [];

  switch (status) {
    case 'otp_verified':
      query = `
        UPDATE rides 
        SET 
          status = 'accepted',
          payment_status = 'paid',
          updated_at = datetime('now')
        WHERE id = ? AND status = 'accepted'
      `;
      params = [rideId];
      break;
    
    case 'in_progress':
      query = `
        UPDATE rides 
        SET 
          status = 'in_progress',
          actual_pickup_time = datetime('now'),
          updated_at = datetime('now')
        WHERE id = ? AND status = 'accepted'
      `;
      params = [rideId];
      break;
    
    case 'completed':
      query = `
        UPDATE rides 
        SET 
          status = 'completed',
          actual_drop_time = datetime('now'),
          updated_at = datetime('now')
        WHERE id = ? AND status = 'in_progress'
      `;
      params = [rideId];
      break;
    
    default:
      return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error updating ride status:', err);
      return res.status(500).json({ error: 'Failed to update ride status' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Ride not found or invalid status transition' });
    }

    res.json({ success: true, message: 'Ride status updated successfully' });
  });
});

// Get driver's current ride
router.get('/driver/:driverId/current', (req, res) => {
  const { driverId } = req.params;

  const query = `
    SELECT 
      r.id,
      u.name as student_name,
      u.phone as student_phone,
      r.pickup_location as from_location,
      r.drop_location as to_location,
      r.status,
      r.created_at as accepted_at,
      r.actual_pickup_time as otp_verified_at,
      r.actual_drop_time as ride_ended_at,
      '1234' as otp
    FROM rides r
    JOIN users u ON r.student_id = u.id
    WHERE r.driver_id = ? 
    AND r.status IN ('accepted', 'in_progress')
    ORDER BY r.created_at DESC
    LIMIT 1
  `;

  db.get(query, [driverId], (err, row) => {
    if (err) {
      console.error('Error fetching current ride:', err);
      return res.status(500).json({ error: 'Failed to fetch current ride' });
    }

    if (!row) {
      return res.json(null);
    }

    res.json(row);
  });
});

// Get driver statistics
router.get('/driver/:driverId/stats', (req, res) => {
  const { driverId } = req.params;

  const query = `
    SELECT 
      COUNT(*) as total_rides,
      COALESCE(SUM(r.fare), 0) as total_earnings,
      COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_rides
    FROM rides r
    WHERE r.driver_id = ?
  `;

  db.get(query, [driverId], (err, row) => {
    if (err) {
      console.error('Error fetching driver stats:', err);
      return res.status(500).json({ error: 'Failed to fetch driver statistics' });
    }

    res.json(row);
  });
});

// Get all ride history for admin
router.get('/history', (req, res) => {
  const { type, date } = req.query;

  let query = `
    SELECT 
      r.id,
      d.name as driver_name,
      u.name as passenger_name,
      r.pickup_location as from_location,
      r.drop_location as to_location,
      r.fare,
      r.created_at as payment_success_time,
      r.actual_pickup_time as ride_start_time,
      r.actual_drop_time as ride_end_time,
      r.is_pre_booking,
      r.status,
      DATE(r.created_at) as date,
      (SELECT COUNT(*) FROM rides r2 WHERE r2.driver_id = r.driver_id AND r2.created_at <= r.created_at) as driver_nth_ride
    FROM rides r
    JOIN users u ON r.student_id = u.id
    LEFT JOIN drivers d ON r.driver_id = d.id
    WHERE 1=1
  `;

  const params = [];

  if (type === 'prebook') {
    query += ' AND r.is_pre_booking = 1';
  } else if (type === 'normal') {
    query += ' AND r.is_pre_booking = 0';
  }

  if (date) {
    query += ' AND DATE(r.created_at) = ?';
    params.push(date);
  }

  query += ' ORDER BY r.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching ride history:', err);
      return res.status(500).json({ error: 'Failed to fetch ride history' });
    }

    res.json(rows);
  });
});

// Get all drivers with their details
router.get('/drivers', (req, res) => {
  const query = `
    SELECT 
      d.id,
      d.name,
      d.phone,
      u.email,
      d.vehicle_type,
      d.vehicle_number,
      d.status,
      d.is_online,
      d.total_rides,
      d.total_earnings,
      d.created_at as joined_at,
      (SELECT r.actual_drop_time FROM rides r WHERE r.driver_id = d.id ORDER BY r.created_at DESC LIMIT 1) as last_ride_at,
      4.5 as average_rating
    FROM drivers d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.status = 'approved'
    ORDER BY d.total_rides DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching drivers:', err);
      return res.status(500).json({ error: 'Failed to fetch drivers' });
    }

    res.json(rows);
  });
});

// Update driver online status
router.put('/driver/:driverId/status', (req, res) => {
  const { driverId } = req.params;
  const { isOnline } = req.body;

  const query = `
    UPDATE drivers 
    SET 
      is_online = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `;

  db.run(query, [isOnline ? 1 : 0, driverId], function(err) {
    if (err) {
      console.error('Error updating driver status:', err);
      return res.status(500).json({ error: 'Failed to update driver status' });
    }

    res.json({ success: true, message: 'Driver status updated successfully' });
  });
});

module.exports = router;
