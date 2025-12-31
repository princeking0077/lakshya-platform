const http = require('http');

console.log('STARTING MINIMAL DIAGNOSTIC SERVER...');

// CRITICAL: Hostinger provides PORT via environment variable
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    console.log('Received Request:', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Minimal Server is WORKING on PORT ${PORT}! Issue likely in main app dependencies/DB.`);
});

server.listen(PORT, () => {
    console.log(`Minimal server listening on port ${PORT}`);
});
