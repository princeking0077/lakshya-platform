# FINAL DEPLOYMENT STEPS - Fix 503 Errors

## Current Situation Analysis

✅ **What's Working:**
- Build completes successfully (all 33 pages generated)
- `/out` directory contains 326 static files (committed to Git)
- Environment variables are set correctly in Hostinger
- `app.js` server code is correct
- Package.json configuration is correct

❌ **What's NOT Working:**
- **Hostinger is NOT running `npm start` after the build completes**
- This means the Express server never starts
- Result: 503 errors on ALL pages (homepage, /setup-db, /api/*, etc.)

## Root Cause

When you push to GitHub → Hostinger:
1. ✅ Hostinger pulls the code
2. ✅ Hostinger runs `npm install`
3. ✅ Hostinger runs `npm run build` (if configured)
4. ❌ **Hostinger STOPS HERE** - it does NOT run `npm start`
5. ❌ No Express server running = 503 errors

## THE SOLUTION: Manual Hostinger Configuration

You MUST configure Hostinger to run the start command. Choose ONE of the options below:

---

## OPTION 1: Hostinger Node.js Panel (RECOMMENDED)

### Step 1: Access Node.js Panel

1. Log into **Hostinger**
2. Go to **Websites** → Select your site
3. Click **Advanced** → **Node.js**
4. If you don't see "Node.js" option, your plan might not support it - skip to Option 2

### Step 2: Configure Application

Set these EXACT values:

| Setting | Value |
|---------|-------|
| **Application Root** | `/domains/forestgreen-marten-883875.hostingersite.com/public_html` (or your actual path) |
| **Node.js Version** | 18.x or higher |
| **Application Mode** | Production |
| **Application Startup File** | `app.js` |
| **OR Startup Command** | `npm start` |
| **Build Command** | `npm run build` (if available) |

### Step 3: Restart Application

1. Click **Stop** (if running)
2. Click **Start**
3. Wait 30 seconds
4. Status should show **"Running"**

### Step 4: Check Logs

Go to **Logs** and verify you see:

```
=== Express Server Starting ===
Environment: production
Port: 3000
✓ MySQL Database Connected Successfully
✓ All API routes loaded successfully
✓ Server running on port 3000
✓ Serving static files from: .../out
```

### Step 5: Test

Visit: `https://forestgreen-marten-883875.hostingersite.com/`

**Expected:** Homepage loads (no 503)

---

## OPTION 2: SSH Manual Deployment (If No Node.js Panel)

### Step 1: SSH into Hostinger

```bash
ssh u480091743@forestgreen-marten-883875.hostingersite.com
```

### Step 2: Navigate to Your App

```bash
# Find your app directory (it might be in one of these locations):
cd domains/forestgreen-marten-883875.hostingersite.com/public_html/.builds/source/repository/client
# OR
cd domains/forestgreen-marten-883875.hostingersite.com/public_html/client
# OR
cd public_html/client

# Verify you're in the right place:
ls -la
# You should see: app.js, package.json, out/ directory
```

### Step 3: Verify Build Exists

```bash
ls -la out/
# Should see: index.html, admin/, setup-db/, _next/, etc.
```

If `/out` is empty or missing:

```bash
npm run build
```

### Step 4: Install Dependencies (if needed)

```bash
# Only if node_modules is missing:
npm install
```

### Step 5: Kill Any Existing Process

```bash
# Kill any old Node.js processes:
pkill -f "node app.js"
pkill -f "npm start"
```

### Step 6: Start Server in Background

```bash
# Start server with nohup (keeps running after SSH disconnect):
nohup npm start > server.log 2>&1 &

# OR if you have PM2 installed:
pm2 start app.js --name lakshya-platform
pm2 save
pm2 startup
```

### Step 7: Verify Server Started

```bash
# Check if process is running:
ps aux | grep "node app.js"

# Check logs:
tail -f server.log
# Press Ctrl+C to stop viewing logs

# You should see:
# ✓ Server running on port 3000
```

### Step 8: Test from Browser

Visit: `https://forestgreen-marten-883875.hostingersite.com/`

**Expected:** Homepage loads successfully!

---

## OPTION 3: Contact Hostinger Support

If you cannot access Node.js panel or SSH:

### Contact Hostinger Support and Request:

1. **Enable Node.js** for domain: `forestgreen-marten-883875.hostingersite.com`
2. **Set Application Root** to: `/domains/forestgreen-marten-883875.hostingersite.com/public_html/client`
3. **Set Node.js Version** to: `18.x`
4. **Set Startup File** to: `app.js`
5. **Set Startup Command** to: `npm start`
6. **Start the application**

---

## Verification Checklist

After server starts, test these URLs in order:

### 1. Homepage ✅
```
https://forestgreen-marten-883875.hostingersite.com/
```
**Expected:** EnlightenPharma homepage with "Welcome Back" section

### 2. Debug Endpoint ✅
```
https://forestgreen-marten-883875.hostingersite.com/api/debug-server
```
**Expected:**
```json
{
  "status": "express-static-server-active",
  "envVars": {
    "DB_USER": "SET",
    "DB_PASS": "SET",
    "DB_NAME": "SET",
    "JWT_SECRET": "SET"
  },
  "paths": {
    "outExists": true,
    "adminExists": true
  }
}
```

### 3. Health Check ✅
```
https://forestgreen-marten-883875.hostingersite.com/health
```
**Expected:**
```json
{
  "status": "ok",
  "database": { "connected": true }
}
```

### 4. Initialize Database ✅
```
https://forestgreen-marten-883875.hostingersite.com/api/setup-db
```
**Expected:**
```json
{
  "success": true,
  "message": "Database Initialized Successfully!"
}
```

### 5. Admin Login ✅
```
https://forestgreen-marten-883875.hostingersite.com/admin
```
**Credentials:**
- Email: `shoaib.ss300@gmail.com`
- Password: `Shaikh@#$001`

**Expected:** Login successful, dashboard loads

---

## Troubleshooting

### Server Won't Start in SSH

**Check logs:**
```bash
tail -f server.log
```

**Common errors:**

1. **Port 3000 already in use:**
   ```bash
   # Kill process on port 3000:
   lsof -ti:3000 | xargs kill -9
   # Then start again
   ```

2. **Cannot find module:**
   ```bash
   npm install
   # Then start again
   ```

3. **Database connection failed:**
   - Check environment variables are set in Hostinger panel
   - Server will still start, but database operations will fail
   - You'll see warning in logs: "MySQL Connection Failed"

### Still Getting 503 After Server Starts

**Possible causes:**

1. **Wrong port mapping:** Check Hostinger is routing to port 3000
2. **Firewall blocking:** Contact Hostinger support
3. **Server crashed after start:** Check logs for errors

---

## What Happens After Successful Deployment

1. **Homepage loads** - Static Next.js pages served from `/out`
2. **API endpoints work** - Express routes handle `/api/*` requests
3. **Database initializes** - Visit `/api/setup-db` to create tables
4. **Admin can login** - Use credentials at `/admin`
5. **Students can register** - At `/register` (need admin approval)

---

## Important Notes

- **DO NOT** add back the postinstall hook - it prevents server startup
- **DO commit** the `/out` directory to Git - contains pre-built pages
- **DO NOT commit** the `/.next` directory - it's build cache
- **Environment variables** must be set in Hostinger panel, not `.env` file
- **After code changes** - push to GitHub, Hostinger rebuilds, YOU MUST RESTART the server

---

## Summary: What You Need to Do NOW

**The code is ready. The build works. The server code is correct.**

**You just need to START THE SERVER on Hostinger.**

Choose the easiest option for you:
- ✅ **Option 1**: Configure in Hostinger Node.js panel (easiest)
- ✅ **Option 2**: SSH and run `nohup npm start > server.log 2>&1 &` (manual)
- ✅ **Option 3**: Contact Hostinger support (if other options unavailable)

**Once the server is running, all 503 errors will be resolved!**
