# Hostinger Deployment Guide

## Prerequisites

Your Hostinger plan must support Node.js applications (VPS or Node.js hosting).

## Environment Variables (Set in Hostinger Panel)

Go to your Hostinger control panel → Environment Variables and set:

```
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_random_secret_string_here
PORT=3000
```

## Deployment Steps

### 1. Pull Latest Code from GitHub

```bash
cd /path/to/your/app/client
git pull origin main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

This creates the `/out` directory with static HTML files.

### 4. Start/Restart the Server

**Using PM2 (recommended):**
```bash
pm2 restart lakshya-platform
# or if first time:
pm2 start app.js --name lakshya-platform
pm2 save
```

**Using direct node:**
```bash
# Kill existing process
pkill -f "node app.js"
# Start new process
nohup node app.js > server.log 2>&1 &
```

**Using npm:**
```bash
npm start
```

### 5. Initialize Database (First Time Only)

Visit: `https://your-domain.com/setup-db`

Click "Initialize Database" button.

### 6. Login

Admin credentials (after database initialization):
- Email: `shoaib.ss300@gmail.com`
- Password: `Shaikh@#$001`

## Troubleshooting

### 503 Service Unavailable

**Check if server is running:**
```bash
ps aux | grep node
# or with PM2:
pm2 list
```

**Check logs:**
```bash
pm2 logs lakshya-platform
# or if using nohup:
tail -f server.log
```

**Common issues:**
1. Missing environment variables → Set them in Hostinger panel
2. Database connection failed → Check DB credentials
3. Port already in use → Kill old process or use different port
4. Missing node_modules → Run `npm install`

### Check Health Endpoint

```bash
curl http://localhost:3000/health
# or
curl https://your-domain.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Debug Server Status

```bash
curl http://localhost:3000/api/debug-server
# or
curl https://your-domain.com/api/debug-server
```

## File Structure

```
/client
├── app.js              # Main server (runs on Hostinger)
├── package.json        # Dependencies
├── /out               # Static HTML (built from src)
├── /backend           # API routes
└── /src               # Next.js source (builds to /out)
```

## Important Notes

- **Static files** are served from `/out` directory
- **API routes** are handled by Express in `app.js`
- **Build is required** after any code changes
- **Database must be initialized** before login works
- **Students need approval** after registration
