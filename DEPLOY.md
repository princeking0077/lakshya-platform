# Hostinger Deployment Guide - Enlighten Pharma

Complete guide for deploying the Lakshya Platform (Enlighten Pharma) to Hostinger.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Process](#deployment-process)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Hostinger account with Node.js hosting
- GitHub repository access
- MySQL database created in Hostinger cPanel
- Domain configured (enlightenpharma.in)

---

## Initial Setup

### 1. Database Setup

In Hostinger cPanel:

1. Navigate to **Databases → MySQL Databases**
2. Note down these values (you'll need them):
   - **Database Host**: Usually `localhost` (check your cPanel)
   - **Database Name**: e.g., `u480091743_lakshay`
   - **Database Username**: e.g., `u480091743_shoaibpurna`
   - **Database Password**: Your MySQL password

### 2. Node.js Application Setup

In Hostinger cPanel:

1. Navigate to **Advanced → Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/youruser/domains/enlightenpharma.in/public_html`
   - **Application URL**: https://enlightenpharma.in
   - **Application startup file**: `server/startup.js`

---

## Environment Configuration

### Setting Environment Variables

In Hostinger cPanel → **Advanced → Setup Node.js App** → Select your app → **Environment Variables**:

Add the following variables:

```bash
PORT=5000
NODE_ENV=production

# Database Configuration (use values from step 1)
DB_HOST=localhost
DB_USER=u480091743_shoaibpurna
DB_PASS=your_mysql_password
DB_NAME=u480091743_lakshay

# Security
JWT_SECRET=generate_random_32_char_string_here
```

**To generate a secure JWT_SECRET**, run this locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Optional Environment Variables

```bash
LOG_LEVEL=info
LOG_DIR=/tmp/logs
```

---

## Deployment Process

### Step 1: Local Preparation

On your local machine:

1. **Ensure client is built**:
   ```bash
   cd client
   npm run build
   ```

2. **Copy build to server folder**:
   - Build output from `client/out/` should be in `server/client_build/`
   - Verify `server/client_build/index.html` exists

3. **Verify .env is NOT committed**:
   ```bash
   git status
   # Should NOT show server/.env
   ```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "fix: Production deployment setup for Hostinger"
git push origin main
```

### Step 3: Deploy on Hostinger

In Hostinger cPanel → **Advanced → Git Version Control**:

1. If not already set up:
   - Click **Create Repository**
   - Enter your GitHub repository URL
   - Configure branch: `main`

2. Pull latest changes:
   - Click **Pull** or **Update**
   - Wait for deployment to complete

3. Install dependencies:
   - Hostinger should auto-install
   - Or manually: SSH in and run `cd server && npm install`

4. Restart application:
   - In **Setup Node.js App** → Click **Restart**

---

## Verification

### Step 1: Check Health Endpoint

Visit: **https://enlightenpharma.in/health**

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "uptime": 123.456,
  "server": {
    "running": true,
    "port": 5000,
    "nodeVersion": "v18.x.x",
    "memory": { "used": 50, "total": 100, "unit": "MB" }
  },
  "database": {
    "connected": true,
    "responseTime": "15ms",
    "error": null
  },
  "frontend": {
    "built": true,
    "indexExists": true,
    "path": "/path/to/client_build"
  }
}
```

### Step 2: Initialize Database (First Deployment Only)

Visit: **https://enlightenpharma.in/setup-db**

Expected response:
```json
{
  "success": true,
  "message": "Database Initialized and Admin Reset!"
}
```

**Default Admin Credentials**:
- Username: `admin`
- Password: `admin123` (change after first login!)

### Step 3: Access Application

Visit: **https://enlightenpharma.in**

You should see the login page.

---

## Troubleshooting

### Issue: ERR_FAILED or Site Not Loading

**Possible Causes**:

1. **Missing Environment Variables**
   - Check: cPanel → Setup Node.js App → Environment Variables
   - Verify all required variables are set
   - Restart app after adding variables

2. **Database Connection Failed**
   - Check `/health` endpoint
   - Verify `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` are correct
   - Ensure MySQL database exists in cPanel

3. **Frontend Build Missing**
   - Check `/health` endpoint → `frontend.indexExists`
   - Verify `server/client_build/index.html` exists in repository
   - Rebuild client and push to GitHub

4. **Wrong Startup File**
   - In cPanel → Setup Node.js App
   - Application startup file should be: `server/startup.js`
   - NOT `index.js` or `server/index.js`

### Issue: Database Connection Failed

Check `/health` endpoint. If `database.connected` is `false`:

1. **Verify credentials** in environment variables match cPanel → Databases
2. **Check DB_HOST**: Usually `localhost`, but could be different
   - In cPanel → Databases, look for "Connection Details"
3. **Test database access**:
   - In cPanel → phpMyAdmin
   - Verify you can access the database with those credentials

### Issue: API Endpoints Return 404

1. **Check server logs** in Hostinger cPanel → Setup Node.js App → Logs
2. **Verify routes** are loaded:
   - Check startup logs for any route loading errors
3. **Restart application** in cPanel

### Issue: Static Files Not Loading (CSS/JS)

1. **Check** `server/client_build/` folder has all files:
   - `index.html`
   - `_next/` folder with JS/CSS
   - Other static assets

2. **Verify** `next.config.ts` has:
   ```typescript
   output: 'export',
   trailingSlash: true,  // Critical for Hostinger
   ```

3. **Rebuild** if necessary:
   ```bash
   cd client
   rm -rf out .next
   npm run build
   cp -r out/* ../server/client_build/
   ```

### Viewing Logs

**In Hostinger cPanel**:
1. Navigate to **Setup Node.js App**
2. Select your application
3. Click **Show Logs** or **Error Log**

**Server Logs Location**:
- Application logs: Check Hostinger's Node.js app logs
- Custom logs: `server/logs/` (if LOG_DIR not set)

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing required environment variables" | Environment variables not set | Set in cPanel Environment Variables |
| "MySQL Connection Failed" | Wrong DB credentials | Verify DB credentials in cPanel |
| "client_build/index.html missing" | Frontend not built | Build client and commit to git |
| "EADDRINUSE" | Port already in use | Restart app in cPanel |
| "Cannot find module" | Dependencies not installed | Run `npm install` in server folder |

---

## Post-Deployment Checklist

- [ ] Health endpoint returns `status: "ok"`
- [ ] Database connected (`/health` shows `database.connected: true`)
- [ ] Frontend loads (`/health` shows `frontend.indexExists: true`)
- [ ] Can access login page at https://enlightenpharma.in
- [ ] Database initialized (`/setup-db` completed successfully)
- [ ] Admin login works with default credentials
- [ ] Changed admin password from default
- [ ] All environment variables set in Hostinger (not from .env file)
- [ ] `.env` file NOT committed to git

---

## Security Recommendations

1. **Change Default Admin Password** immediately after first login
2. **Use Strong JWT_SECRET** (32+ random characters)
3. **Never Commit .env** to git - use Hostinger environment variables
4. **Enable HTTPS** (should be automatic with Hostinger SSL)
5. **Regular Backups** of database through cPanel

---

## Support

If issues persist:

1. Check **Hostinger Support** documentation
2. Review **server logs** in cPanel
3. Use `/health` endpoint for diagnostic information
4. Check `server/logs/error.log` for detailed errors

---

## Quick Reference

**Important URLs**:
- Main Site: https://enlightenpharma.in
- Health Check: https://enlightenpharma.in/health
- Database Setup: https://enlightenpharma.in/setup-db

**Important Files**:
- Startup Script: `server/startup.js`
- Main Server: `server/index.js`
- Database Config: `server/config/db.js`
- Environment Template: `server/.env.example`

**Required Environment Variables**:
- `PORT`, `NODE_ENV`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`
