#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Serveur HTTP simple avec support UTF-8 correct pour les fichiers HTML
"""

import http.server
import socketserver
import os

class UTF8HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Force UTF-8 pour les fichiers HTML
        if self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css; charset=utf-8')
        elif self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        super().end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        # Ajouter charset UTF-8 si c'est du texte
        if mimetype and mimetype.startswith('text/'):
            return mimetype + '; charset=utf-8'
        return mimetype

PORT = 8000

if __name__ == "__main__":
    os.chdir('/Users/alex/Desktop/widget-dsfr')
    
    with socketserver.TCPServer(("", PORT), UTF8HTTPRequestHandler) as httpd:
        print(f"Serveur démarré sur http://localhost:{PORT}")
        print("Encoding UTF-8 forcé pour tous les fichiers HTML/CSS/JS")
        print("Appuyez sur Ctrl+C pour arrêter le serveur")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServeur arrêté")