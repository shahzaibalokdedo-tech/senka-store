#!/usr/bin/env python3
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from a2wsgi import ASGIMiddleware
    from app.main import app
    wsgi_app = ASGIMiddleware(app)
except Exception as e:
    def wsgi_app(environ, start_response):
        status = '500 Internal Server Error'
        response_headers = [('Content-type', 'text/plain')]
        start_response(status, response_headers)
        return [f"Backend Startup Error: {e}".encode('utf-8')]

if __name__ == "__main__":
    from wsgiref.handlers import CGIHandler
    CGIHandler().run(wsgi_app)
