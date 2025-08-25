#!/usr/bin/env python3
"""
Serveur HTTP simple pour tester le dashboard avec support CORS
Usage: python3 serve-dashboard.py
Puis ouvrir: http://localhost:8000/signalconso-dashboard-global.html
"""

import http.server
import socketserver
import os

PORT = 8000

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
    print(f"🚀 Serveur démarré sur http://localhost:{PORT}")
    print(f"📊 Dashboard: http://localhost:{PORT}/signalconso-dashboard-global.html")
    print("Appuyez sur Ctrl+C pour arrêter")
    httpd.serve_forever()