const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin.cjs');
const heroApplicationsRoutes = require('./routes/heroApplications.js');
const heroAuthRoutes = require('./routes/heroAuth.cjs');
const prebookRoutes = require('./routes/prebook.cjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/heroApplications', heroApplicationsRoutes);
app.use('/api/heroes', heroAuthRoutes);
app.use('/api/prebook', prebookRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
