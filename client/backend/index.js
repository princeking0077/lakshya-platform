const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- IN-MEMORY ACCESS LOG (For Debugging) ---
const requestLogs = [];
app.use((req, res, next) => {
  const logEntry = {
    method: req.method,
    url: req.url,
    time: new Date().toISOString(),
    ip: req.ip
  };
  requestLogs.unshift(logEntry);
  if (requestLogs.length > 50) requestLogs.pop(); // Keep last 50
  console.log(`${logEntry.method} ${logEntry.url}`);
  next();
});

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);
app.use(cors());
app.use(express.json());

// --- PATH FINDING LOGIC ---
const possiblePaths = [
  path.resolve(__dirname, '../out'),
  path.join(process.cwd(), 'out'),
  path.join(process.cwd(), 'client/out'),
  path.resolve(__dirname, 'client_build')
];

let staticPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    staticPath = p;
    console.log(`✓ Serving static files from: ${staticPath}`);
    break;
  }
}

if (!staticPath) {
  console.error('CRITICAL: No static build directory found!');
}

// --- DEBUG ENDPOINTS (Must be before static) ---
app.get(['/debug', '/api/debug', '/api/debug-files', '/api/debug-files/'], (req, res) => {
  const nextPath = staticPath ? path.join(staticPath, '_next') : 'N/A';
  res.json({
    status: 'online',
    staticPath,
    nextPath,
    nextExists: staticPath ? fs.existsSync(nextPath) : false,
    cwd: process.cwd(),
    dirname: __dirname,
    logs: requestLogs
  });
});

// --- STATIC FILE SERVING ---
if (staticPath) {
  // 1. Explicitly serve _next with dotfiles allowed
  // Important: next.js assets requests start with /_next/
  app.use('/_next', express.static(path.join(staticPath, '_next'), {
    dotfiles: 'allow',
    fallthrough: false
  }));

  // 2. Serve root files
  app.use(express.static(staticPath, {
    dotfiles: 'allow'
  }));
}

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- API ROUTES ---
const initDB = require('./init_db');
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


// --- CATCH-ALL (SPA Support) ---
app.get('*', (req, res) => {
  if (staticPath && fs.existsSync(path.join(staticPath, 'index.html'))) {
    res.sendFile(path.join(staticPath, 'index.html'));
  } else {
    res.status(404).send('Site is building or maintenance mode. (No static files found)');
  }
});

// CRASH PREVENTION
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
