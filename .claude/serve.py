# Servidor local para desarrollo: igual que `python -m http.server`, pero sin caché,
# para que el navegador cargue siempre la última versión de CSS y JS.
import http.server
import sys


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
http.server.ThreadingHTTPServer(('127.0.0.1', port), NoCache).serve_forever()
