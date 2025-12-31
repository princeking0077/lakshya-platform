const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME types for Next.js assets
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json'
};

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // 1. Handle Debug Endpoint
    if (req.url === '/test-debug') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'simple-server-active',
            cwd: process.cwd(),
            dirname: __dirname,
            env: process.env.NODE_ENV
        }));
        return;
    }

    // 2. Determine File Path
    // Try multiple locations for 'out' folder
    const possibleRoots = [
        path.join(__dirname, '../out'),
        path.join(process.cwd(), 'out'),
        path.join(process.cwd(), 'client/out')
    ];

    let staticRoot = null;
    for (const root of possibleRoots) {
        if (fs.existsSync(root)) {
            staticRoot = root;
            break;
        }
    }

    if (!staticRoot) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('CRITICAL: Static build directory (out) not found on server.');
        return;
    }

    // Normalize URL
    let requestUrl = req.url.split('?')[0]; // Remove query params

    // Handle root
    if (requestUrl === '/') requestUrl = '/index.html';

    let filePath = path.join(staticRoot, requestUrl);

    // Security: Prevent directory traversal
    if (!filePath.startsWith(staticRoot)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // 404 Fallback -> index.html (SPA Support)
            // Only for non-asset requests (don't serve HTML for missing CSS)
            if (!requestUrl.match(/\.(css|js|png|jpg|ico|json)$/)) {
                const fallbackPath = path.join(staticRoot, 'index.html');
                fs.readFile(fallbackPath, (err2, data) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    }
                });
            } else {
                res.writeHead(404);
                res.end('404 Not Found');
            }
            return;
        }

        // Serve File
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Simple Static Server running on port ${PORT}`);
});
