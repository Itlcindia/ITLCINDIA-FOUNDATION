const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all client connections (can narrow down to specific URLs in prod)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Static Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const donationRoutes = require('./routes/donations');

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/donations', donationRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ITLC Foundation Backend is active.' });
});

// Auto-seed default admin if admins table is empty
async function seedDefaultAdmin() {
  try {
    // Check if table exists (avoids crashes if DB script wasn't run yet)
    const [tables] = await pool.query("SHOW TABLES LIKE 'admins'");
    if (tables.length === 0) {
      console.log('Database tables do not exist yet. Please run db_schema.sql first.');
      return;
    }

    const [rows] = await pool.query('SELECT COUNT(*) as count FROM admins');
    if (rows[0].count === 0) {
      const defaultPassword = 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(defaultPassword, salt);
      
      await pool.query(
        'INSERT INTO admins (username, password_hash, email, is_subadmin) VALUES (?, ?, ?, ?)',
        ['admin', hash, 'admin@itlcfoundation.org', 0]
      );
      console.log('--------------------------------------------------');
      console.log('DEFAULT ADMIN ACCOUNT REGISTERED:');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('--------------------------------------------------');
    }
  } catch (error) {
    console.error('Error seeding default admin account:', error);
  }
}

// Start Server and Test DB connection
async function startServer() {
  try {
    // Test DB connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to XAMPP MySQL database.');
    connection.release();

    // Auto-seed default admin
    await seedDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`ITLC Backend Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed. Please ensure MySQL is running on XAMPP.');
    console.error('Error Details:', error.message);
    // Exit server if database is not reachable
    process.exit(1);
  }
}

startServer();
