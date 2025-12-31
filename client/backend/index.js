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

// DEBUG ROUTE (Placed at top to avoid interference)
app.get(['/api/debug-files', '/api/debug-files/'], (req, res) => {
  // Check multiple possible paths
  const possiblePaths = [
    path.resolve(__dirname, '../out'),
    path.join(process.cwd(), 'out'),
    path.join(process.cwd(), 'client/out'),
    path.resolve(__dirname, 'client_build')
  ];

  const fs = require('fs');
  let validPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      validPath = p;
      break;
    }
  }

  res.json({
    message: 'Debug Endpoint Active',
    cwd: process.cwd(),
    dirname: __dirname,
    detectedStaticPath: validPath,
    pathsChecked: possiblePaths,
    filesInStatic: validPath ? fs.readdirSync(validPath) : [],
    timestamp: new Date().toISOString()
  });
});

// Serve Static Frontend (Self-Contained)
// Try multiple paths to find the 'out' directory
const possiblePaths = [
  path.resolve(__dirname, '../out'),       // If running from client/backend
  path.join(process.cwd(), 'out'),         // If running from client root
  path.join(process.cwd(), 'client/out'),  // If running from project root
  path.resolve(__dirname, 'client_build')  // Fallback to old build
];

let staticPath = possiblePaths[0]; // Default
let foundPath = false;

const fs = require('fs');
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    staticPath = p;
    foundPath = true;
    console.log(`✓ Found static files at: ${staticPath}`);
    break;
  }
}

if (!foundPath) {
  console.error('CRITICAL: Could not find static build directory!');
  console.error('Checked paths:', possiblePaths);
}

// Explicitly serve _next folder to ensure assets load
app.use('/_next', express.static(path.join(staticPath, '_next')));
app.use(express.static(staticPath));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const initDB = require('./init_db');

// Setup Route (Direct)
app.get('/setup-db', async (req, res) => {
  try {
    await initDB();
    res.status(200).json({ success: true, message: 'Database Initialized and Admin Reset!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Setup Failed: ' + error.message });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/results', require('./routes/results'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/health', require('./routes/health'));

// Debug Route: List files in static directory
app.get(/\/api\/debug-files\/?/, (req, res) => {
  const nextPath = path.join(staticPath, '_next');

  const result = {
    cwd: process.cwd(),
    dirname: __dirname,
    selectedStaticPath: staticPath,
    exists: {
      static: fs.existsSync(staticPath),
      next: fs.existsSync(nextPath)
    },
    checkedPaths: possiblePaths,
    filesInStatic: fs.existsSync(staticPath) ? fs.readdirSync(staticPath) : [],
    // filesInNext: fs.existsSync(nextPath) ? fs.readdirSync(nextPath) : [] // Commented to avoid huge list
  };
  res.json(result);
});
// app.use('/api/sys-setup', require('./routes/setup')); // Removed in favor of direct route

// Catch-All Handler for SPA (Next.js)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// CRASH PREVENTION
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  // Keep alive if possible, or exit gracefully
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
