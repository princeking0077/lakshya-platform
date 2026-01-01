# 🛠️ PHP Management Tools - Complete Reference

## Overview

Your application now has 3 powerful PHP tools that solve all deployment and testing issues on Hostinger:

1. **start-server.php** - Server management
2. **test-auth.php** - Authentication testing
3. **index.php** + **.htaccess** - Auto-proxy (background)

---

## 🚀 Tool 1: start-server.php

**Purpose:** Start, stop, restart, and monitor your Node.js server

**URL:** `https://forestgreen-marten-883875.hostingersite.com/start-server.php`

### Features:
- ✅ View server status (Running/Stopped)
- ✅ Start server with one click
- ✅ Stop server
- ✅ Restart server (use after code changes)
- ✅ View live server logs
- ✅ See Node.js processes
- ✅ Check server health

### When to Use:
- **First deployment** → Start the server
- **After code changes** → Restart the server
- **Site showing 503** → Check if server is running
- **Debugging issues** → View logs
- **Server crashed** → Restart it

### Common Actions:

**Start Server (First Time)**
1. Visit `/start-server.php`
2. Click "▶️ Start Server"
3. Wait 2-3 seconds
4. Status shows "RUNNING" → Done!

**Restart Server (After Updates)**
1. Push code to GitHub
2. Wait for Hostinger to pull
3. Visit `/start-server.php`
4. Click "🔄 Restart Server"
5. New code is now live!

**Check Logs**
1. Visit `/start-server.php`
2. Scroll to bottom
3. Read "Recent Logs" section
4. Look for errors or warnings

---

## 🔐 Tool 2: test-auth.php

**Purpose:** Test and debug authentication (registration, login, database)

**URL:** `https://forestgreen-marten-883875.hostingersite.com/test-auth.php`

### Features:
- ✅ Test student registration
- ✅ Test login (admin & student)
- ✅ Execute database queries (SELECT only)
- ✅ Test any API endpoint
- ✅ View server status
- ✅ Quick links to all pages
- ✅ Common issues reference

### When to Use:
- **Registration not working** → Test with tool
- **Login fails** → Check if user is approved
- **Need to check database** → Run SELECT queries
- **API endpoint broken** → Test it directly
- **Don't know what's wrong** → Use this tool first!

### Common Actions:

**Test Registration**
1. Visit `/test-auth.php`
2. Go to "Test Registration" card
3. Fill in name, email, password (or use defaults)
4. Click "Test Registration"
5. See JSON response → Success or error message

**Test Login**
1. Visit `/test-auth.php`
2. Go to "Test Login" card
3. Enter credentials:
   - Admin: `shoaib.ss300@gmail.com` / `Shaikh@#$001`
   - Student: Their registered email/password
4. Click "Test Login"
5. Success → See token and user data
6. Fail → See exact error message

**Check Database**
1. Visit `/test-auth.php`
2. Go to "Test Database Query" card
3. Use this query to see users:
   ```sql
   SELECT id, name, email, role, is_approved FROM users LIMIT 10
   ```
4. Click "Execute Query"
5. See all users and their approval status

**Test API Endpoint**
1. Visit `/test-auth.php`
2. Go to "Test Any API Endpoint" card
3. Choose GET or POST
4. Enter endpoint (e.g., `/api/dashboard`)
5. Click "Test Endpoint"
6. See response

---

## 🔄 Tool 3: index.php + .htaccess (Background)

**Purpose:** Automatically proxy all requests to Node.js server

**How it Works:**
- User visits your domain
- Apache catches request
- `.htaccess` routes to Node.js on port 3000
- If server not running, `index.php` starts it
- Response sent to user

**You don't need to use this directly** - it works automatically in the background!

---

## 🗺️ Complete Workflow

### First Time Setup

1. **Push code to GitHub** → Hostinger pulls automatically
2. **Visit `/start-server.php`** → Click "Start Server"
3. **Visit `/api/setup-db`** → Initialize database
4. **Visit `/`** → Homepage should load!
5. **Visit `/admin`** → Login as admin
6. **Visit `/register`** → Students can register

### After Code Changes

1. **Push to GitHub** → Hostinger pulls and rebuilds
2. **Visit `/start-server.php`** → Click "Restart Server"
3. **Test your changes** → They're live!

### When Something Breaks

1. **Visit `/start-server.php`** → Check if server is running
2. If stopped → Start it
3. If running but broken → Check logs
4. **Visit `/test-auth.php`** → Test specific functionality
5. **Visit `/api/debug-server`** → Check env vars and paths

### Student Registration Flow

1. **Student visits `/register`** → Fills form, clicks Register
2. **Backend creates user** → `is_approved = 0` (pending)
3. **Student tries to login** → Error: "Account pending approval"
4. **Admin logs in** → Goes to Students section
5. **Admin approves student** → Sets `is_approved = 1`
6. **Student can now login** → Success!

**To test this flow:**
- Use `/test-auth.php` to register test student
- Try login → Should fail
- Login as admin at `/admin` and approve
- Try login again → Should work!

---

## 📋 Quick Reference

### URLs to Bookmark

| Tool | URL | When to Use |
|------|-----|-------------|
| Server Manager | `/start-server.php` | Start/restart server |
| Auth Tester | `/test-auth.php` | Debug login issues |
| Server Debug | `/api/debug-server` | Check env vars |
| Database Setup | `/api/setup-db` | Initialize DB |
| Homepage | `/` | Test if site works |
| Admin Panel | `/admin` | Manage platform |
| Register | `/register` | Test registration |
| Login | `/login` | Test login |

### Common Commands (What They Do)

| Action | What Happens | When |
|--------|--------------|------|
| Start Server | `nohup node app.js &` | First deployment |
| Restart Server | `kill PID && node app.js &` | After code changes |
| Initialize DB | Creates tables + admin user | First time setup |
| Approve Student | `is_approved = 1` in database | Student registered |
| Check Logs | `tail -f node-server.log` | Debugging errors |

### File Locations on Server

```
/domains/forestgreen-marten-883875.hostingersite.com/public_html/
├── start-server.php       ← Server manager (BOOKMARK THIS)
├── test-auth.php          ← Auth tester (BOOKMARK THIS)
├── index.php              ← Auto-proxy (runs automatically)
├── .htaccess              ← Routing rules
├── app.js                 ← Node.js server
├── node-server.pid        ← Process ID (auto-created)
├── node-server.log        ← Server logs (auto-created)
├── out/                   ← Static Next.js pages
├── backend/               ← API routes
└── src/                   ← Next.js source code
```

---

## 🐛 Troubleshooting

### Issue: All pages show 503

**Cause:** Node.js server not running

**Solution:**
1. Visit `/start-server.php`
2. Click "Start Server"
3. Wait 2-3 seconds
4. Refresh your page

---

### Issue: Registration works but login fails

**Cause:** Student not approved by admin

**Solution:**
1. Visit `/test-auth.php`
2. Run query: `SELECT id, name, email, is_approved FROM users WHERE role='student'`
3. Find student with `is_approved = 0`
4. Login as admin at `/admin`
5. Go to Students → Approve student
6. Student can now login

---

### Issue: Can't login as admin

**Cause:** Database not initialized or credentials wrong

**Solution:**
1. Visit `/api/setup-db` to ensure admin exists
2. Use exact credentials:
   - Email: `shoaib.ss300@gmail.com`
   - Password: `Shaikh@#$001`
3. If still fails, check `/test-auth.php` → Test Login

---

### Issue: Server starts but crashes immediately

**Cause:** Code error or database connection failed

**Solution:**
1. Visit `/start-server.php`
2. Check logs at bottom
3. Look for error message
4. Common errors:
   - "Cannot connect to database" → Check env vars
   - "Port already in use" → Restart server
   - "Cannot find module" → Run `npm install` via SSH

---

### Issue: Homepage loads but API fails

**Cause:** Static files work but server routes broken

**Solution:**
1. Visit `/api/debug-server` → Should return JSON
2. If 503 → Server not running
3. If 200 → Check specific API endpoint at `/test-auth.php`

---

## 💡 Pro Tips

1. **Bookmark both tools** (`/start-server.php` and `/test-auth.php`) - you'll use them often
2. **Always restart after code changes** - Node.js doesn't auto-reload
3. **Check logs first when debugging** - they show exact errors
4. **Use test-auth.php instead of Postman** - it's faster and easier
5. **Keep `/api/debug-server` open in a tab** - shows env var status
6. **Test with admin login first** - if that works, backend is fine
7. **Remember students need approval** - most common "login fails" cause

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ `/start-server.php` shows "Server Status: RUNNING"
- ✅ `/` loads the homepage
- ✅ `/admin` admin can login
- ✅ `/test-auth.php` registration test succeeds
- ✅ `/test-auth.php` login test succeeds for admin
- ✅ Students can register (creates pending user)
- ✅ Admin can approve students
- ✅ Approved students can login
- ✅ No 503 errors anywhere

---

## 📞 Getting Help

If still stuck:

1. **Check logs** at `/start-server.php`
2. **Run all tests** at `/test-auth.php`
3. **Verify env vars** at `/api/debug-server`
4. **Read** `AUTH_TROUBLESHOOTING.md` for detailed solutions
5. **Read** `FINAL_DEPLOYMENT_STEPS.md` for deployment issues

---

## Summary

**Three PHP tools solve everything:**

1. **start-server.php** → Manages your Node.js server ✅
2. **test-auth.php** → Tests and debugs authentication ✅
3. **index.php + .htaccess** → Auto-proxies requests ✅

**All accessible from your browser. No SSH needed. No command line. Just click and test!** 🎉
