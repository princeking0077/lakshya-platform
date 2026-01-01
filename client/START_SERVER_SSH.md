# Start Server via SSH (Direct Method)

## The Problem

The PHP-based server starter (`start-server.php`) may not work on Hostinger's shared hosting because:
- Shared hosting restricts background process execution
- `shell_exec()` and `exec()` functions may be disabled
- Process management commands may not be available

## The Solution: SSH Access

You need to start the server manually via SSH. This is a **ONE-TIME setup** that keeps running.

---

## Step 1: Access SSH

### Option A: Using Hostinger's Built-in SSH

1. **Login to Hostinger** control panel
2. **Go to Advanced** → **SSH Access**
3. **Click "Open SSH Terminal"** (opens in browser)

### Option B: Using PuTTY (Windows)

1. **Download PuTTY**: https://www.putty.org/
2. **Open PuTTY**
3. **Enter Host Name**:
   ```
   enlightenpharma.in
   ```
   OR
   ```
   forestgreen-marten-883875.hostingersite.com
   ```
4. **Port**: `22`
5. **Click "Open"**
6. **Login**:
   - Username: `u480091743`
   - Password: Your Hostinger SSH password

### Option C: Using Terminal (Mac/Linux)

```bash
ssh u480091743@enlightenpharma.in
```

Enter password when prompted.

---

## Step 2: Navigate to Your Application

Once connected via SSH:

```bash
# Go to your application directory
cd domains/enlightenpharma.in/public_html

# OR if it's in a different location:
cd domains/forestgreen-marten-883875.hostingersite.com/public_html

# Verify you're in the right place
ls -la
# You should see: app.js, package.json, out/, backend/, etc.
```

---

## Step 3: Check if Node.js is Available

```bash
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# If not found, contact Hostinger support to enable Node.js
```

---

## Step 4: Install Dependencies (if needed)

```bash
# Check if node_modules exists
ls -la | grep node_modules

# If missing, install dependencies
npm install

# Wait for installation to complete (may take 1-2 minutes)
```

---

## Step 5: Verify Build Exists

```bash
# Check if out/ directory exists
ls -la | grep out

# Check if it has files
ls -la out/

# If out/ is empty or missing, build it:
npm run build

# Wait for build to complete (may take 2-3 minutes)
```

---

## Step 6: Kill Any Existing Node Processes

```bash
# Check for existing Node.js processes
ps aux | grep node

# If you see any, kill them
pkill -f "node app.js"
pkill -f "npm start"

# Or kill by PID if you see one:
# kill <PID>
```

---

## Step 7: Start the Server

### Method 1: Using nohup (Recommended)

```bash
# Start server in background with nohup
nohup npm start > server.log 2>&1 &

# This command:
# - Starts the server
# - Redirects output to server.log
# - Runs in background (&)
# - Keeps running after you disconnect (nohup)
```

### Method 2: Using PM2 (If Available)

```bash
# Check if PM2 is installed
pm2 --version

# If installed, use PM2:
pm2 start app.js --name enlightenpharma

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Method 3: Using screen (Alternative)

```bash
# Start a screen session
screen -S nodeserver

# Start the server
npm start

# Press Ctrl+A then D to detach
# Server keeps running in background
```

---

## Step 8: Verify Server Started

```bash
# Wait 5 seconds for server to start
sleep 5

# Check if process is running
ps aux | grep "node app.js"

# You should see something like:
# u480091743  12345  0.5  2.1  123456 78900 ?  Sl  12:00  0:01 node app.js

# Check server logs
tail -f server.log

# You should see:
# === Express Server Starting ===
# ✓ MySQL Database Connected Successfully
# ✓ Server running on port 3000

# Press Ctrl+C to stop viewing logs (server keeps running)
```

---

## Step 9: Test from Browser

Open your browser and visit:

```
https://enlightenpharma.in/
```

**Your site should now be LIVE!** 🎉

Also test:
- `/api/debug-server` - Should return JSON
- `/health` - Should return `{"status": "ok"}`
- `/admin` - Should load admin login page

---

## Managing Your Server

### To View Logs

```bash
ssh u480091743@enlightenpharma.in
cd domains/enlightenpharma.in/public_html
tail -f server.log
# Press Ctrl+C to exit
```

### To Restart Server

```bash
ssh u480091743@enlightenpharma.in
cd domains/enlightenpharma.in/public_html

# Kill existing process
pkill -f "node app.js"

# Start again
nohup npm start > server.log 2>&1 &
```

### To Stop Server

```bash
ssh u480091743@enlightenpharma.in

# Kill Node.js process
pkill -f "node app.js"
```

### To Check if Server is Running

```bash
# Check process
ps aux | grep "node app.js"

# Check port
netstat -tuln | grep 3000

# Test health endpoint
curl http://localhost:3000/health
# Should return: {"status":"ok",...}
```

---

## After Code Changes

When you push new code to GitHub:

```bash
# SSH into server
ssh u480091743@enlightenpharma.in
cd domains/enlightenpharma.in/public_html

# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart server
pkill -f "node app.js"
nohup npm start > server.log 2>&1 &

# Verify
tail -f server.log
```

---

## Troubleshooting

### "Permission denied" when starting server

```bash
# Check file permissions
ls -la app.js

# Make sure you're in the right directory
pwd

# Try with full path
nohup node /home/u480091743/domains/enlightenpharma.in/public_html/app.js > server.log 2>&1 &
```

### "Port 3000 already in use"

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or kill all node processes
pkill -f node

# Start server again
nohup npm start > server.log 2>&1 &
```

### "Cannot find module"

```bash
# Install dependencies
npm install

# Start server
nohup npm start > server.log 2>&1 &
```

### "Database connection failed"

```bash
# Check if environment variables are loaded
cat .env

# If .env doesn't exist, create it:
nano .env

# Add these lines:
NODE_ENV=production
DB_HOST=localhost
DB_USER=u480091743_shoaibpurna
DB_PASS=Sk@001001
DB_NAME=u480091743_lakshay
JWT_SECRET=5f8d9a2b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c
PORT=3000

# Press Ctrl+X, then Y, then Enter to save

# Restart server
pkill -f "node app.js"
nohup npm start > server.log 2>&1 &
```

### Server starts but crashes immediately

```bash
# Check logs for error
cat server.log

# Common errors and fixes:
# - "Cannot connect to database" → Check .env file
# - "EADDRINUSE" → Port already in use, kill process
# - "Cannot find module" → Run npm install
```

---

## Alternative: Create a Startup Script

Create a file `start.sh` for easier management:

```bash
# Create the script
nano start.sh

# Add this content:
#!/bin/bash
cd /home/u480091743/domains/enlightenpharma.in/public_html
pkill -f "node app.js"
sleep 2
nohup node app.js > server.log 2>&1 &
echo "Server started. Check logs with: tail -f server.log"

# Press Ctrl+X, then Y, then Enter to save

# Make it executable
chmod +x start.sh

# Now you can start server with:
./start.sh
```

---

## Success Criteria

Your server is running successfully when:

✅ `ps aux | grep "node app.js"` shows a process
✅ `tail -f server.log` shows "Server running on port 3000"
✅ `curl http://localhost:3000/health` returns JSON
✅ `https://enlightenpharma.in/` loads in browser
✅ No 503 errors anywhere

---

## Summary

**Quick Start Commands:**

```bash
# SSH into server
ssh u480091743@enlightenpharma.in

# Go to app directory
cd domains/enlightenpharma.in/public_html

# Start server
nohup npm start > server.log 2>&1 &

# Check if running
ps aux | grep node

# View logs
tail -f server.log

# Done! Your site is live.
```

**After this ONE-TIME setup, your server will keep running until you stop it or the server reboots.**

If Hostinger reboots the server, you'll need to SSH in and restart using the commands above.
