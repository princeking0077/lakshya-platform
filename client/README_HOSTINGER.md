# Enlighten Pharma - Hostinger Automated Deployment

This application is configured for **automated deployment on Hostinger**.

## 🚀 Automatic Setup

When you connect this repository to Hostinger via GitHub integration:

1. **Hostinger pulls code** from GitHub
2. **Automatically runs** `npm install`
3. **Automatically builds** via `postinstall` script → creates `/out` directory
4. **Starts server** with `npm start` → runs `node app.js`

**No manual commands needed!**

## 📋 Prerequisites on Hostinger

### 1. Environment Variables

Set these in **Hostinger Control Panel → Environment Variables**:

```env
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
JWT_SECRET=random_secret_key_min_32_chars
PORT=3000
```

### 2. Node.js Version

Ensure Node.js >= 18.0.0 is selected in Hostinger panel.

### 3. Start Command

In Hostinger deployment settings, set:
```
npm start
```

Or if using the startup script:
```
bash start.sh
```

## 🏗️ Architecture

```
User Request
    ↓
app.js (Express Server on Port 3000)
    ↓
    ├─→ /api/* ──→ Backend API (MySQL Database)
    └─→ /* ──────→ Static HTML from /out directory
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app.js` | **Main server** - Entry point |
| `/out/*` | **Static HTML** - Pre-built pages (committed to Git) |
| `package.json` | Dependencies & scripts |
| `.npmrc` | NPM configuration for production |
| `start.sh` | Startup script (optional) |

## 🔧 How Deployment Works

### Step 1: Hostinger Pulls from GitHub
```bash
git pull origin main
```

### Step 2: Install Dependencies
```bash
npm install
# This automatically triggers:
# npm run build (via postinstall)
# → Creates /out directory
```

### Step 3: Start Server
```bash
npm start
# → Runs: node app.js
# → Server listens on port 3000
# → Serves /out for pages, /api for backend
```

## 🎯 First Time Setup (After Deployment)

### 1. Visit Setup Page
```
https://your-domain.com/setup-db
```

Click "Initialize Database" button.

### 2. Login as Admin
```
Email: shoaib.ss300@gmail.com
Password: Shaikh@#$001
```

## 🩺 Health Checks

### Check if Server is Running
```
https://your-domain.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "server": { "running": true },
  "database": { "connected": true },
  "frontend": { "built": true }
}
```

### Debug Server Status
```
https://your-domain.com/api/debug-server
```

Shows startup errors if any.

## 🔄 How to Update

### Option 1: Push to GitHub (Recommended)
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Hostinger auto-deploys from GitHub.

### Option 2: Manual Update (if auto-deploy not configured)
1. SSH into Hostinger
2. `cd /path/to/app/client`
3. `git pull origin main`
4. Restart: `pm2 restart all` or restart in Hostinger panel

## ⚠️ Troubleshooting

### 503 Service Unavailable

**Cause:** Server not running or crashed.

**Solutions:**
1. Check Hostinger logs
2. Verify environment variables are set
3. Restart application in Hostinger panel
4. Check `/health` endpoint for errors

### Database Connection Failed

**Cause:** Wrong database credentials or DB server down.

**Solutions:**
1. Verify `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` in environment variables
2. Ensure MySQL service is running
3. Check database permissions

### Build Failures

**Cause:** Missing dependencies or build errors.

**Solutions:**
1. Check Node.js version >= 18.0.0
2. Verify `package.json` is present
3. Check Hostinger build logs
4. Ensure `/out` directory is committed to Git (fallback)

### Login Fails

**Cause:** Database not initialized.

**Solutions:**
1. Visit `/setup-db` first
2. Click "Initialize Database"
3. Then try logging in

## 📞 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | Student registration |
| `/api/dashboard` | GET | Admin dashboard stats |
| `/api/setup-db` | GET | Initialize database |
| `/health` | GET | Health check |

## 🎓 Student Registration

Students can register at `/register`. Admin must approve them at `/admin/students` before they can login.

## 📚 Additional Resources

- Full deployment guide: `HOSTINGER_DEPLOY.md`
- Backend API routes: `/backend/routes/`
- Frontend pages: `/src/app/`

---

**✅ This application is production-ready for Hostinger!**

All necessary files are committed to Git, including:
- Pre-built static files (`/out`)
- Build cache (`.next`)
- Automated build script (`postinstall`)
