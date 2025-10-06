// Usage:
// node backend/create-admin.cjs --username=admin --password=admin123 --email=admin@example.com
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  return [k, v];
}));

if (!args.username || !args.password) {
  console.error('Missing required args. Example:');
  console.error('  node backend/create-admin.cjs --username=admin --password=admin123 --email=admin@example.com');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const dbPath = path.resolve(repoRoot, 'database.db');
const db = new Database(dbPath);

try {
  const hash = bcrypt.hashSync(args.password, 10);
  const stmt = db.prepare('INSERT INTO Admins (username, password_hash, email) VALUES (?,?,?)');
  stmt.run(args.username, hash, args.email || null);
  console.log('Admin created successfully:', args.username);
} catch (err) {
  if (String(err).includes('UNIQUE')) {
    console.error('Username or email already exists.');
  } else {
    console.error('Error creating admin:', err);
  }
  process.exitCode = 1;
} finally {
  db.close();
}


