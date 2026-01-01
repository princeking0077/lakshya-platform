# PHP Solution for Hostinger Node.js Deployment

## The Problem
Hostinger's Node.js hosting isn't automatically starting your Express server after deployment, causing 503 errors.

## The Solution
Use PHP (which Hostinger supports natively) to start and manage your Node.js server.

---

## How It Works

1. **start-server.php** - Web interface to start/stop/restart your Node.js server
2. **index.php** - Automatically starts server (if needed) and proxies all requests to Node.js
3. **.htaccess** - Routes all traffic through the PHP proxy to your Node.js app

---

## Step-by-Step Setup

### Step 1: Deploy Files to Hostinger

Push these new files to GitHub (they're already in your repo):
- `start-server.php`
- `index.php`
- `.htaccess`

Hostinger will automatically pull them.

### Step 2: Start the Server

Visit this URL in your browser:
```
https://forestgreen-marten-883875.hostingersite.com/start-server.php
```

You'll see a management interface with:
- ✅ Current server status
- ▶️ Start Server button
- ⏹️ Stop Server button
- 🔄 Restart Server button
- 📋 Server information
- 📝 Live logs

**Click "Start Server"** and wait 2-3 seconds.

### Step 3: Verify It's Working

After starting, the page will show:
```
✅ Server Status: RUNNING
✅ Server is responding on port 3000
```

Click the links to test:
- **Visit Homepage** - Should load EnlightenPharma homepage
- **Admin Panel** - Should load admin login
- **Debug Info** - Should show server status JSON

### Step 4: Access Your Site

Now visit your normal URL:
```
https://forestgreen-marten-883875.hostingersite.com/
```

**All 503 errors should be GONE!** 🎉

---

## How the Routing Works

```
User visits your domain
        ↓
.htaccess catches the request
        ↓
Checks if Node.js server is running on port 3000
        ↓
If NOT running → index.php starts it automatically
        ↓
If running → Proxies request to http://127.0.0.1:3000
        ↓
Node.js Express server handles request
        ↓
Response sent back to user
```

---

## Managing Your Server

### To Start Server
Visit: `/start-server.php` and click "Start Server"

### To Stop Server
Visit: `/start-server.php` and click "Stop Server"

### To Restart Server (after code changes)
Visit: `/start-server.php` and click "Restart Server"

### To Check Status
Visit: `/start-server.php` and click "Refresh Status"

### To View Logs
Visit: `/start-server.php` - logs are shown at the bottom

---

## After Code Changes

When you push new code to GitHub:

1. Hostinger auto-pulls and rebuilds
2. Visit `/start-server.php`
3. Click **"Restart Server"**
4. New code is now live!

---

## Troubleshooting

### If you see "Server Status: NOT RUNNING"

**Solution**: Click "Start Server" button

### If server starts but shows "not responding"

**Check**:
1. Click "Refresh Status" after 5 seconds
2. Check logs at bottom of page for errors
3. Make sure environment variables are set in Hostinger

**Common errors**:
- **Port already in use**: Click "Restart Server"
- **Database connection failed**: Check env vars in Hostinger panel
- **Cannot find module**: Run `npm install` via SSH

### If you get 503 after server shows running

**Check**:
1. `.htaccess` file exists in the root
2. Apache mod_proxy is enabled (contact Hostinger if not)
3. Port 3000 is accessible locally

**Alternative**: If proxy doesn't work, the fallback `index.php` will handle it

### Server keeps stopping

**Possible causes**:
1. Code crashes - check logs
2. Database connection fails - check env vars
3. Memory limit - contact Hostinger to increase

**Solution**: Fix the error in logs, then restart

---

## File Locations

After deployment, these files will be in:
```
/domains/forestgreen-marten-883875.hostingersite.com/public_html/
├── start-server.php    ← Management interface
├── index.php           ← Auto-starter & proxy
├── .htaccess           ← Routing rules
├── app.js              ← Your Node.js server
├── node-server.pid     ← Process ID (auto-created)
└── node-server.log     ← Server logs (auto-created)
```

---

## Advantages of This Solution

✅ **No SSH needed** - Manage server from web browser
✅ **Auto-start** - Server starts automatically on first request
✅ **Easy management** - Simple web interface
✅ **Persistent** - Server keeps running after you close browser
✅ **Logs visible** - See what's happening in real-time
✅ **Works with Hostinger's PHP** - Uses what they support best

---

## Complete Verification Checklist

After starting server via `/start-server.php`:

### 1. Management Interface ✅
```
https://forestgreen-marten-883875.hostingersite.com/start-server.php
```
Should show: "Server Status: RUNNING"

### 2. Homepage ✅
```
https://forestgreen-marten-883875.hostingersite.com/
```
Should show: EnlightenPharma homepage

### 3. Debug Endpoint ✅
```
https://forestgreen-marten-883875.hostingersite.com/api/debug-server
```
Should return JSON with server info

### 4. Health Check ✅
```
https://forestgreen-marten-883875.hostingersite.com/health
```
Should return: `{"status": "ok", "database": {...}}`

### 5. Setup Database ✅
```
https://forestgreen-marten-883875.hostingersite.com/api/setup-db
```
Should return: `{"success": true, "message": "Database Initialized Successfully!"}`

### 6. Admin Login ✅
```
https://forestgreen-marten-883875.hostingersite.com/admin
```
Should load admin login page
Login with:
- Email: `shoaib.ss300@gmail.com`
- Password: `Shaikh@#$001`

---

## Important Notes

1. **Bookmark `/start-server.php`** - You'll use this to manage your server

2. **After every deployment** - Visit `/start-server.php` and click "Restart Server"

3. **Server keeps running** - It won't stop unless you click "Stop Server" or it crashes

4. **Check logs regularly** - The logs show any errors or issues

5. **Environment variables** - Still need to be set in Hostinger panel

---

## If This Still Doesn't Work

If the PHP proxy approach fails:

**Last resort option**:
1. Contact Hostinger support
2. Ask them to enable Node.js hosting for your domain
3. OR upgrade to a VPS plan with full Node.js support

But this PHP solution should work on standard shared hosting!

---

## Summary

**What you need to do RIGHT NOW:**

1. ✅ Push the code (it's ready to commit below)
2. ✅ Wait for Hostinger to pull the changes
3. ✅ Visit: `https://forestgreen-marten-883875.hostingersite.com/start-server.php`
4. ✅ Click **"Start Server"**
5. ✅ Visit your homepage - it should work!

**That's it! No SSH, no complex configuration, just one click!** 🚀
