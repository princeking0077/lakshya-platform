const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const path = require('path');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

console.log('-----------------------------------');
console.log('   LAKSHYA SERVER STARTING...      ');
console.log('-----------------------------------');
console.log('Current Directory:', __dirname);
console.log('Static Files Path:', path.join(__dirname, 'client_build'));

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to avoid static file issues
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased limit for static resources
});
app.use(limiter);

app.use(cors());
app.use(express.json());

// Serve Static Frontend (Self-Contained)
app.use(express.static(path.join(__dirname, 'client_build')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/results', require('./routes/results'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/sys-setup', require('./routes/setup'));

// Catch-All Handler for SPA (Next.js)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client_build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
