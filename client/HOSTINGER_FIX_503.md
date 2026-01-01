# Fixing 503 Errors - Complete Hostinger Configuration Guide

## Current Situation
- ✅ Build completes successfully (all 33 pages generated)
- ✅ /out directory contains all static files (committed to Git)
- ✅ Environment variables are set correctly
- ❌ Homepage shows 503
- ❌ All pages show 503

## Root Cause
**Hostinger is NOT running the start command after pulling/building the code.**

## Solution: Manual Hostinger Configuration

### Step 1: Access Hostinger Control Panel

1. Log into **Hostinger**
2. Go to **Websites** → Your domain
3. Click on **Advanced** → **Node.js**

### Step 2: Verify Application Settings

Check/Set these settings:

#### Application Configuration
- **Application root**: `/domains/forestgreen-marten-883875.hostingersite.com/public_html` or similar
- **Application URL**: Your domain URL
- **Application mode**: Production
- **Node.js version**: 18.x or higher (18.20.0 recommended)

#### Entry Point
- **Application startup file**: `app.js`
  OR
- **Application startup command**: `npm start`

### Step 3: Set Build Command (if available)

If Hostinger has a "Build Command" option:
- **Build command**: `npm run build`

If NOT available, the build is already done (files in /out are committed).

### Step 4: Restart Application

1. **Stop** the application (if running)
2. **Start** the application
3. Wait 30 seconds
4. Check status - should show **"Running"**

### Step 5: Check Application Logs

1. Go to **Node.js** → **Logs** or **Application Logs**
2. Look for:

**Success** - You should see:
```
=== Express Server Starting ===
Environment: production
Port: 3000
Database Configuration: {...}
✓ MySQL Database Connected Successfully
✓ All API routes loaded successfully
✓ Server running on port 3000
✓ Serving static files from: .../out
✓ API endpoints available at: /api/*
```

**Error** - If you see errors, note them and see Troubleshooting below.

## Alternative: If Node.js Panel Doesn't Have Start Command

### Option A: Use PM2 (if available)

SSH into Hostinger and run:
```bash
cd /path/to/your/app/client
pm2 start app.js --name lakshya-platform
pm2 save
pm2 startup
```

### Option B: Create .htaccess (if using Apache)

Create `/public_html/.htaccess`:
```apache
DirectoryIndex disabled
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

Then start server manually via SSH:
```bash
cd /path/to/your/app/client
nohup npm start > server.log 2>&1 &
```

### Option C: Contact Hostinger Support

If you can't find the Node.js configuration panel:

1. **Contact Hostinger Support** via chat/ticket
2. **Ask them to**:
   - Enable Node.js for your domain
   - Set Application startup file to `app.js`
   - Or set Startup command to `npm start`
   - Set Node.js version to 18.x
   - Start the application

## Verification Steps

After configuration and restart:

### 1. Check Homepage
```
https://forestgreen-marten-883875.hostingersite.com/
```
**Expected**: EnlightenPharma homepage with "Welcome Back" section

### 2. Check Debug Endpoint
```
https://forestgreen-marten-883875.hostingersite.com/api/debug-server
```
**Expected**: JSON response with:
```json
{
  "status": "express-static-server-active",
  "envVars": {...all showing "SET"},
  "paths": {"outExists": true, "adminExists": true}
}
```

### 3. Check Health
```
https://forestgreen-marten-883875.hostingersite.com/health
```
**Expected**: `{"status": "ok", "database": {"connected": true}}`

### 4. Initialize Database
```
https://forestgreen-marten-883875.hostingersite.com/api/setup-db
```
**Expected**: `{"success": true, "message": "Database Initialized Successfully!"}`

### 5. Login
```
https://forestgreen-marten-883875.hostingersite.com/admin
```
**Expected**: Login page loads
- Email: shoaib.ss300@gmail.com
- Password: Shaikh@#$001
- Should login successfully

## Troubleshooting

### "Application Status: Stopped"

**Fix**:
1. Click **Start** button
2. Wait 30 seconds
3. Refresh page
4. Check status again

### "Application Status: Error"

**Fix**:
1. Check logs for specific error
2. Common errors:
   - **Port already in use**: Change PORT env var to 3001
   - **Cannot find module**: Run `npm install` via SSH
   - **Database connection**: Check DB credentials in env vars

### "No Node.js Panel in Hostinger"

Your hosting plan might not support Node.js apps.

**Options**:
1. Upgrade to a plan that supports Node.js (VPS or Node.js hosting)
2. Contact support to enable Node.js
3. Use a different deployment method (Docker, etc.)

### Still Getting 503 After All Steps

**Last Resort - Manual Deployment**:

1. **SSH into Hostinger**:
   ```bash
   ssh u480091743@forestgreen-marten-883875.hostingersite.com
   ```

2. **Navigate to app**:
   ```bash
   cd domains/forestgreen-marten-883875.hostingersite.com/public_html/.builds/source/repository/client
   # OR wherever your client folder is
   ```

3. **Check if files exist**:
   ```bash
   ls -la
   # Should see: app.js, package.json, out/ directory
   ```

4. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

5. **Check if build exists**:
   ```bash
   ls -la out/
   # Should see: index.html, admin/, setup-db/, etc.
   ```

6. **If out/ is empty, build it**:
   ```bash
   npm run build
   ```

7. **Start the server**:
   ```bash
   # Kill any existing process first
   pkill -f "node app.js"

   # Start in background
   nohup npm start > server.log 2>&1 &
   ```

8. **Check if server started**:
   ```bash
   ps aux | grep "node app.js"
   # Should show running process

   # Check logs
   tail -f server.log
   # Should show "Server running on port 3000"
   ```

9. **Test from browser**:
   - Visit your homepage
   - Should now work!

## Key Hostinger Settings Summary

| Setting | Value |
|---------|-------|
| Application Root | `/domains/.../public_html` or `/domains/.../client` |
| Node.js Version | 18.x or higher |
| Startup File | `app.js` |
| OR Startup Command | `npm start` |
| Environment | production |
| PORT | 3000 (or 3001 if 3000 in use) |

## Success Criteria

✅ Application status shows "Running"
✅ Logs show "Server running on port 3000"
✅ Homepage loads (no 503)
✅ /api/debug-server returns JSON
✅ Admin login works

Once all criteria are met, your application is successfully deployed!
