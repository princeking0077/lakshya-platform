# Domain Setup Complete! 🎉

Your custom domain **https://enlightenpharma.in/** is now connected to Hostinger.

## Current Status

✅ Domain connected: `enlightenpharma.in`
❌ Server not running yet (showing 503)

## Quick Fix - Start Your Server

### Step 1: Visit Server Manager

Go to one of these URLs:

**Primary domain:**
```
https://enlightenpharma.in/start-server.php
```

**Hostinger subdomain (backup):**
```
https://forestgreen-marten-883875.hostingersite.com/start-server.php
```

### Step 2: Click "Start Server"

You'll see a page with a button that says **"▶️ Start Server"**

Click it and wait 2-3 seconds.

### Step 3: Visit Your Site

Go to:
```
https://enlightenpharma.in/
```

**Your site should now be live!** 🚀

---

## All Your URLs (Updated)

### Main Site
- Homepage: `https://enlightenpharma.in/`
- Register: `https://enlightenpharma.in/register`
- Login: `https://enlightenpharma.in/login`
- Admin Panel: `https://enlightenpharma.in/admin`

### Management Tools
- Server Manager: `https://enlightenpharma.in/start-server.php`
- Auth Tester: `https://enlightenpharma.in/test-auth.php`

### API Endpoints
- Debug Server: `https://enlightenpharma.in/api/debug-server`
- Setup Database: `https://enlightenpharma.in/api/setup-db`
- Health Check: `https://enlightenpharma.in/health`

---

## What to Do After Starting Server

### 1. Initialize Database (First Time Only)
Visit:
```
https://enlightenpharma.in/api/setup-db
```

Should return:
```json
{"success": true, "message": "Database Initialized Successfully!"}
```

This creates:
- All database tables
- Admin user (email: shoaib.ss300@gmail.com, password: Shaikh@#$001)

### 2. Test Admin Login
Visit:
```
https://enlightenpharma.in/admin
```

Login with:
- **Email:** `shoaib.ss300@gmail.com`
- **Password:** `Shaikh@#$001`

### 3. Test Student Registration
Visit:
```
https://enlightenpharma.in/register
```

Fill out the form and register a test student.

**Important:** Students need admin approval before they can login!

### 4. Approve Students
1. Login as admin
2. Go to Students section
3. Find pending students (is_approved = 0)
4. Click "Approve" button
5. Student can now login

---

## Troubleshooting

### Issue: Can't access start-server.php

If `https://enlightenpharma.in/start-server.php` doesn't work, try:

1. **Use Hostinger subdomain:**
   ```
   https://forestgreen-marten-883875.hostingersite.com/start-server.php
   ```

2. **Wait 5 minutes** for DNS propagation

3. **Clear browser cache** and try again

### Issue: 503 Error on all pages

**Cause:** Node.js server not running

**Solution:**
1. Visit `/start-server.php`
2. Click "Start Server"
3. Wait 2-3 seconds
4. Refresh your page

### Issue: Domain shows "Site not found"

**Cause:** DNS not propagated yet

**Solution:**
1. Wait 10-30 minutes for DNS propagation
2. Clear DNS cache on your computer:
   ```
   ipconfig /flushdns  (Windows)
   sudo dscacheutil -flushcache (Mac)
   ```
3. Try again

### Issue: Can access start-server.php but homepage still 503

**Cause:** Server started but crashed

**Solution:**
1. Check logs in `/start-server.php` (scroll to bottom)
2. Look for error messages
3. Common issues:
   - Database connection failed → Check env vars
   - Port already in use → Click "Restart Server"
   - Module not found → Wait for npm install to finish

---

## After Code Changes

Whenever you push new code to GitHub:

1. **Wait** for Hostinger to pull (1-2 minutes)
2. **Visit** `/start-server.php`
3. **Click** "Restart Server"
4. **Test** your changes

---

## SSL Certificate

Your domain `enlightenpharma.in` should have SSL (https) automatically from Hostinger.

If you see "Not Secure" warning:
1. Go to Hostinger control panel
2. Navigate to SSL
3. Enable/force SSL for `enlightenpharma.in`
4. Wait a few minutes for activation

---

## Bookmarks to Save

Save these URLs in your browser bookmarks:

**Essential:**
- ⭐ Server Manager: `https://enlightenpharma.in/start-server.php`
- ⭐ Auth Tester: `https://enlightenpharma.in/test-auth.php`
- ⭐ Admin Panel: `https://enlightenpharma.in/admin`

**For Debugging:**
- Debug Info: `https://enlightenpharma.in/api/debug-server`
- Health Check: `https://enlightenpharma.in/health`

---

## Summary

Your domain `enlightenpharma.in` is connected and ready!

**To go live:**
1. ✅ Visit `https://enlightenpharma.in/start-server.php`
2. ✅ Click "Start Server"
3. ✅ Visit `https://enlightenpharma.in/api/setup-db`
4. ✅ Visit `https://enlightenpharma.in/`

**Your educational platform is now live!** 🎓🚀
