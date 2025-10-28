const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/admin.cjs');
const heroApplicationsRoutes = require('./routes/heroApplications.js');
const heroAuthRoutes = require('./routes/heroAuth.cjs');
const prebookRoutes = require('./routes/prebook.cjs');
const ridesRoutes = require('./routes/rides.cjs');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/heroApplications', heroApplicationsRoutes);
app.use('/api/heroes', heroAuthRoutes);
app.use('/api/prebook', prebookRoutes);
app.use('/api/rides', ridesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
