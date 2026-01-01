# 🚀 QUICK START - Fix 503 Errors in 3 Steps

## The Problem
Your site shows 503 errors because the Node.js server isn't running on Hostinger.

## The Solution
Use the PHP management interface to start your server with ONE CLICK.

---

## Step 1: Wait for Deployment
After pushing to GitHub, wait 1-2 minutes for Hostinger to pull the new files.

---

## Step 2: Start the Server
Open this URL in your browser:
```
https://forestgreen-marten-883875.hostingersite.com/start-server.php
```

You'll see a page like this:
```
🚀 Node.js Server Manager
❌ Server Status: NOT RUNNING
```

**Click the "▶️ Start Server" button**

Wait 2-3 seconds. The page will refresh and show:
```
✅ Server Status: RUNNING
✅ Server is responding on port 3000
```

---

## Step 3: Visit Your Site
Open this URL:
```
https://forestgreen-marten-883875.hostingersite.com/
```

**Your site should now be working!** 🎉

No more 503 errors!

---

## What Just Happened?

The PHP file (`start-server.php`) executed this command on the server:
```bash
nohup node app.js > node-server.log 2>&1 &
```

This started your Express server in the background on port 3000.

The `.htaccess` file routes all requests to your Node.js server:
```
Browser → Apache → Proxy → Node.js (port 3000) → Your App
```

---

## Next Steps

### Initialize Database
Visit:
```
https://forestgreen-marten-883875.hostingersite.com/api/setup-db
```

Should return:
```json
{"success": true, "message": "Database Initialized Successfully!"}
```

### Login to Admin Panel
Visit:
```
https://forestgreen-marten-883875.hostingersite.com/admin
```

Login with:
- **Email**: `shoaib.ss300@gmail.com`
- **Password**: `Shaikh@#$001`

---

## Managing Your Server

### View Status
Visit: `/start-server.php`

### Restart After Code Changes
1. Push code to GitHub
2. Wait for Hostinger to pull
3. Visit `/start-server.php`
4. Click "🔄 Restart Server"

### View Logs
Visit `/start-server.php` and scroll down to see live logs

### Stop Server
Visit `/start-server.php` and click "⏹️ Stop Server"

---

## Troubleshooting

### "Server Status: NOT RUNNING" after clicking Start
**Check the logs** at the bottom of `/start-server.php`

Common issues:
- **Database connection failed** → Check environment variables in Hostinger panel
- **Port already in use** → Click "Restart Server"
- **Cannot find module** → Wait for Hostinger to finish pulling/installing

### Homepage still shows 503
**Wait 10 seconds** then refresh. Server might still be starting.

If still 503:
1. Go to `/start-server.php`
2. Check if it says "RUNNING"
3. If not, click "Start Server" again
4. Check logs for errors

### Server keeps stopping
**Check logs** in `/start-server.php` for crash errors

Usually caused by:
- Database credentials wrong
- Missing environment variables
- Code error causing crash

Fix the error, then restart.

---

## Files You Can Access

| File | Purpose | URL |
|------|---------|-----|
| start-server.php | Manage server | `/start-server.php` |
| Homepage | Your site | `/` |
| Admin Panel | Admin login | `/admin` |
| Debug Info | Server diagnostics | `/api/debug-server` |
| Health Check | Server health | `/health` |
| Setup Database | Initialize DB | `/api/setup-db` |
| Server Logs | View logs | Check in start-server.php |

---

## Success Checklist

✅ Pushed code to GitHub
✅ Visited `/start-server.php`
✅ Clicked "Start Server"
✅ Server status shows "RUNNING"
✅ Homepage loads (no 503)
✅ Admin panel loads
✅ Database initialized via `/api/setup-db`
✅ Admin can login

**If all checked, you're done!** 🎉

---

## Bookmark This

Add `/start-server.php` to your bookmarks. You'll need it every time you deploy new code to restart the server.

**Pro tip**: Make it your homepage so you can easily monitor your server status!
