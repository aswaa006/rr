// Setup script for SQLite admin database and hero applications
// Run: node backend/setup-sqlite.cjs
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Resolve database path relative to repo root
const repoRoot = path.resolve(__dirname, '..');
const dbPath = path.resolve(repoRoot, 'database.db');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log(`Using SQLite DB at: ${dbPath}`);

const db = new Database(dbPath);

try {
  db.pragma('journal_mode = wal');

  // Create Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS Admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_admins_username ON Admins(username);
  `);

  // Create HeroApplications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS HeroApplications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      vehicle_type TEXT NOT NULL,
      vehicle_number TEXT NOT NULL,
      license_url TEXT,
      agreed INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_hero_apps_status ON HeroApplications(status);
    CREATE INDEX IF NOT EXISTS idx_hero_apps_submitted_at ON HeroApplications(submitted_at);
  `);

  // Create Heroes table for hero authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS Heroes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_heroes_email ON Heroes(email);
  `);

  console.log('SQLite setup completed.');
  console.log('Add an admin manually with a hashed password (bcrypt).');
  console.log('Example to insert (run in a Node REPL):');
  console.log(`
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('${dbPath.replace(/\\/g, '\\\\')}');
const hash = bcrypt.hashSync('your_password_here', 10);
db.prepare('INSERT INTO Admins (username, password_hash, email) VALUES (?,?,?)').run('your_username', hash, 'you@example.com');
db.close();
  `.trim());
} catch (err) {
  console.error('Error setting up SQLite:', err);
  process.exitCode = 1;
} finally {
  db.close();
}


