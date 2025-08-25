const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Parse URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Try to serve index.html for directories
                if (fs.existsSync(filePath + '/index.html')) {
                    fs.readFile(filePath + '/index.html', (error, content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - File Not Found</h1>', 'utf-8');
                }
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            // Enable CORS
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🚀 Serveur démarré avec succès !            ║
║                                                ║
║   📍 URLs de test :                           ║
║                                                ║
║   Test API Monitor:                           ║
║   http://localhost:${PORT}/test-api-monitor.html  ║
║                                                ║
║   Demo ApiClient:                             ║
║   http://localhost:${PORT}/examples/widget-apiclient-demo.html ║
║                                                ║
║   Dashboard SignalConso:                      ║
║   http://localhost:${PORT}/examples/signalconso-dashboard-dsfr.html ║
║                                                ║
║   📊 Le monitor API apparaît en bas à droite  ║
║                                                ║
╚════════════════════════════════════════════════╝
    `);
});