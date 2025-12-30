const http = require('http');

console.log('STARTING MINIMAL DIAGNOSTIC SERVER...');

const PORT = 5000;

const server = http.createServer((req, res) => {
    console.log('Received Request:', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minimal Server is WORKING! The issue is likely in the main app code or dependencies.');
});

server.listen(PORT, () => {
    console.log(`Minimal server listening on port ${PORT}`);
});
