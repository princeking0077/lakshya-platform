# Hostinger Deployment Configuration

## Critical Settings in Hostinger Panel

### 1. Application Type
- **Type**: Node.js Application
- **Node Version**: 18.x or higher

### 2. Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: Leave empty (server serves from `/out`)

### 3. Start Configuration
- **Start Command**: `npm start`
- **Entry File**: `app.js`
- **Port**: 3000

### 4. Environment Variables
Set these in Hostinger Panel → Application → Environment Variables:

```
NODE_ENV=production
DB_HOST=localhost
DB_USER=u480091743_shoaibpurna
DB_PASS=Sk@001001
DB_NAME=u480091743_lakshay
JWT_SECRET=5f8d9a2b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c
PORT=3000
```

## Deployment Steps

### Automatic Deployment (Recommended)

1. **Configure GitHub Integration** in Hostinger
2. **Set Build Command**: `npm run build`
3. **Set Start Command**: `npm start`
4. Push to GitHub - Hostinger auto-deploys

### Manual Deployment (If needed)

If auto-deployment fails, SSH into Hostinger and run:

```bash
cd /path/to/app/client

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Start the server (or restart if using PM2)
npm start
# OR if using PM2:
# pm2 restart app.js --name lakshya-platform
```

## Verification Steps

After deployment, verify in this order:

### 1. Check Build Output
In Hostinger logs, you should see:
```
Route (app)
├ ○ /
├ ○ /admin
├ ○ /setup-db
...
○  (Static)  prerendered as static content
```

### 2. Check Server Startup
In Hostinger logs, you should see:
```
=== Express Server Starting ===
Environment: production
Port: 3000
✓ MySQL Database Connected Successfully
✓ All API routes loaded successfully
✓ Server running on port 3000
```

### 3. Test Endpoints

**Homepage**:
```
https://forestgreen-marten-883875.hostingersite.com/
```
Should show: EnlightenPharma homepage

**Debug Endpoint**:
```
https://forestgreen-marten-883875.hostingersite.com/api/debug-server
```
Should return JSON with:
```json
{
  "status": "express-static-server-active",
  "envVars": {
    "DB_USER": "SET",
    "DB_PASS": "SET",
    ...
  },
  "paths": {
    "outExists": true,
    "adminExists": true
  }
}
```

**Health Endpoint**:
```
https://forestgreen-marten-883875.hostingersite.com/health
```
Should return:
```json
{
  "status": "ok",
  "database": { "connected": true },
  "frontend": { "indexExists": true }
}
```

**Initialize Database**:
```
https://forestgreen-marten-883875.hostingersite.com/api/setup-db
```
Should return:
```json
{
  "success": true,
  "message": "Database Initialized Successfully!"
}
```

**Admin Login**:
```
https://forestgreen-marten-883875.hostingersite.com/admin
```
Login with:
- Email: shoaib.ss300@gmail.com
- Password: Shaikh@#$001

## Troubleshooting 503 Errors

### If ALL pages show 503:

**Cause**: Server not running

**Check**:
1. Hostinger Application Status (should show "Running")
2. Application Logs for errors
3. Environment variables are set

**Fix**:
1. Restart application in Hostinger panel
2. Check logs for specific error
3. Verify Start Command is `npm start`
4. Verify Entry File is `app.js`

### If only API endpoints show 503:

**Cause**: Server started but routes crashed

**Check**:
1. Database connection (environment variables)
2. Application logs for route loading errors

**Fix**:
1. Verify all environment variables are set
2. Check database credentials are correct
3. Restart application

### If build fails:

**Cause**: Missing dependencies or configuration issue

**Check**:
1. Node version >= 18.0.0
2. Build logs for specific error

**Fix**:
1. Ensure Build Command is `npm run build`
2. Check if TypeScript is being installed during build
3. Verify `/out` directory is created after build

## Architecture

```
GitHub Push
    ↓
Hostinger Auto-Deploy
    ↓
npm install (install dependencies)
    ↓
npm run build (clean .next → next build → create /out)
    ↓
npm start (node app.js)
    ↓
Express Server Running on Port 3000
    ├─→ Static Files: /out/* (HTML pages)
    ├─→ API Routes: /api/* (MySQL backend)
    └─→ Health Check: /health
```

## Important Notes

1. **Do NOT use postinstall hook** - It prevents proper server startup
2. **/out directory** - Committed to Git (contains pre-built pages)
3. **/.next directory** - Not committed (build cache)
4. **Environment variables** - Must be set in Hostinger panel, not .env file
5. **Database initialization** - Must run `/api/setup-db` once after first deployment
6. **Student approval** - Students must be approved by admin at `/admin/students` before login

## Success Criteria

✅ Build completes without errors
✅ Server shows "running" status in Hostinger
✅ Homepage loads successfully
✅ `/api/debug-server` returns JSON
✅ `/health` shows status "ok"
✅ `/api/setup-db` initializes database
✅ Admin can login at `/admin`

If all criteria are met, deployment is successful!
