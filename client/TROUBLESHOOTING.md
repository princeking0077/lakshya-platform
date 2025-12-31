# Troubleshooting 503 Errors on Hostinger

## Quick Diagnostics

### 1. Check Server Status
Visit: `https://your-domain.com/api/debug-server`

**Expected Response:**
```json
{
  "status": "express-static-server-active",
  "paths": {
    "outExists": true,
    "adminExists": true
  }
}
```

**If you get 503:** The server is not running at all. See "Server Not Running" below.

### 2. Check Health Endpoint
Visit: `https://your-domain.com/health`

**Expected Response:**
```json
{
  "status": "ok",
  "database": { "connected": true },
  "frontend": { "indexExists": true }
}
```

## Common Issues & Solutions

### Issue 1: Server Not Running (503 on all pages)

**Symptoms:**
- All pages show 503
- `/api/debug-server` shows 503
- `/health` shows 503

**Causes:**
1. Build failed during deployment
2. Server crashed on startup
3. Environment variables not set

**Solutions:**

#### A. Check Hostinger Logs
1. Go to Hostinger Control Panel
2. Navigate to your application
3. Click "Logs" or "Application Logs"
4. Look for errors in the deployment log

#### B. Verify Build Completed
Check if `/out` directory was created:
- SSH into Hostinger (if available)
- Run: `ls -la /path/to/app/client/out`
- Should see `index.html` and `admin/` directory

#### C. Check Environment Variables
Ensure these are set in Hostinger panel:
```
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
JWT_SECRET=random_secret_key_min_32_chars
PORT=3000
```

#### D. Manual Restart
In Hostinger panel:
1. Go to your application settings
2. Click "Restart Application" or "Restart Server"
3. Wait 30-60 seconds
4. Try accessing the site again

### Issue 2: Build Fails (Check logs for these errors)

#### Error: "Cannot find module 'typescript'"
**Solution:** Already fixed. Pull latest code from GitHub.

#### Error: "Failed to collect page data for /api/setup-db"
**Solution:** Already fixed. Pull latest code from GitHub.

#### Error: "ENOENT: no such file or directory, open '/out/index.html'"
**Cause:** Build didn't complete successfully
**Solution:**
1. Check Node.js version >= 18.0.0 in Hostinger
2. Check build logs for errors
3. Ensure package.json has correct scripts

### Issue 3: Admin Page Shows 503 (but homepage works)

**Symptoms:**
- Homepage loads fine
- `/admin` shows 503
- Other pages work

**Possible Causes:**
1. `/out/admin/index.html` wasn't built
2. Server routing issue

**Solutions:**

#### A. Verify Admin Files Built
Via `/api/debug-server` check:
```json
{
  "paths": {
    "adminExists": true  // Should be true
  }
}
```

If `false`, rebuild is needed.

#### B. Check Express Routing
The issue might be in `app.js` line 79-102.
Current logic should serve:
- `/admin` → `/out/admin/index.html`
- `/admin/` → `/out/admin/index.html`

### Issue 4: Database Connection Failed

**Symptoms:**
- `/health` shows `"database": { "connected": false }`
- Login fails
- Setup-db fails

**Solutions:**
1. Verify database credentials in environment variables
2. Check if MySQL service is running in Hostinger
3. Try accessing phpMyAdmin to confirm database exists
4. Run `/api/setup-db` to initialize database

### Issue 5: Pages Load but Login Fails

**Symptoms:**
- All pages load correctly
- Login returns error or "pending approval"

**Solutions:**

#### A. Initialize Database First
1. Visit: `https://your-domain.com/setup-db`
2. Click "Initialize Database" button
3. Wait for success message
4. Then try logging in

#### B. Use Correct Credentials
**Admin:**
- Email: `shoaib.ss300@gmail.com`
- Password: `Shaikh@#$001`

**Students:**
- Must be approved by admin first
- Register at `/register`
- Admin approves at `/admin/students`

## Deployment Checklist

Before reporting an issue, verify:

- [ ] Latest code pulled from GitHub
- [ ] Environment variables set in Hostinger panel
- [ ] Node.js version >= 18.0.0
- [ ] Build completed successfully (check logs)
- [ ] Server restarted after deployment
- [ ] `/api/debug-server` returns 200 status
- [ ] `/health` shows status "ok"
- [ ] Database initialized via `/setup-db`

## Manual Deployment Steps (if auto-deploy fails)

If Hostinger auto-deploy is not working:

1. **SSH into Hostinger** (if SSH access available)

2. **Navigate to app directory:**
   ```bash
   cd /path/to/your/app/client
   ```

3. **Pull latest code:**
   ```bash
   git pull origin main
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```
   (This automatically runs `postinstall` → `clean` → `build`)

5. **Verify build:**
   ```bash
   ls -la out/
   ```
   Should see `index.html` and directories

6. **Restart server:**
   ```bash
   pm2 restart all
   # or
   npm start
   ```

## Getting Help

If none of the above works:

1. **Check `/api/debug-server` response** and note:
   - `outExists` value
   - `adminExists` value
   - `startupError` value
   - `outFiles` list

2. **Check Hostinger deployment logs** for exact error message

3. **Check browser console** (F12 → Console) for JavaScript errors

4. **Provide the following info:**
   - Exact URL showing 503
   - Response from `/api/debug-server` (if accessible)
   - Response from `/health` (if accessible)
   - Hostinger deployment log errors
   - Browser console errors

## Architecture Overview

```
User Request → Hostinger
    ↓
app.js (Express Server on Port 3000)
    ↓
    ├─→ /api/* ──→ Backend API Routes (MySQL Database)
    ├─→ /health ──→ Health Check Endpoint
    ├─→ /api/debug-server ──→ Diagnostic Endpoint
    └─→ /* ──────→ Static Files from /out Directory
                   (Pre-built HTML from Next.js)
```

## Key Files

- `app.js` - Main server entry point
- `/out/*` - Pre-built static HTML files
- `package.json` - Build scripts and dependencies
- `.env` - Local environment variables (NOT on Hostinger)
- Hostinger Panel → Environment Variables - Production env vars

## Normal Startup Logs

When server starts correctly, you should see:
```
=== Express Server Starting ===
Environment: production
Port: 3000
✓ All API routes loaded successfully
✓ Server running on port 3000
✓ Serving static files from: /path/to/app/client/out
✓ API endpoints available at: /api/*
```
