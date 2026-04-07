#!/usr/bin/env python3
"""NutrIA server. Serves static files + API for shared meal/override storage."""

import json
import os
import shutil
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_FILE = os.path.join(DATA_DIR, 'local-meals.json')
BACKUP_DIR = os.path.join(DATA_DIR, 'backups')


def load_local():
    if os.path.exists(LOCAL_FILE):
        with open(LOCAL_FILE, 'r') as f:
            return json.load(f)
    return {"meals": [], "overrides": {}}


def save_local(data):
    with open(LOCAL_FILE, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def json_response(handler, data, status=200):
    body = json.dumps(data).encode()
    handler.send_response(status)
    handler.send_header('Content-Type', 'application/json')
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Content-Length', len(body))
    handler.end_headers()
    handler.wfile.write(body)


def read_body(handler):
    length = int(handler.headers.get('Content-Length', 0))
    return json.loads(handler.rfile.read(length))


class NutrIAHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/data':
            json_response(self, load_local())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/meal':
            meal = read_body(self)
            data = load_local()
            # Replace if same id exists, else append
            existing = [i for i, m in enumerate(data["meals"]) if m.get("id") == meal.get("id")]
            if existing:
                data["meals"][existing[0]] = meal
            else:
                data["meals"].append(meal)
            save_local(data)
            json_response(self, {"ok": True})

        elif self.path == '/api/override':
            body = read_body(self)  # {id: "xxx", action: "deleted"}
            data = load_local()
            data["overrides"][body["id"]] = body["action"]
            save_local(data)
            json_response(self, {"ok": True})

        elif self.path == '/api/save-all':
            body = read_body(self)
            save_local(body)
            json_response(self, {"ok": True, "saved": len(body.get("meals", []))})

        elif self.path == '/api/backup':
            now = datetime.now().strftime('%Y-%m-%d_%H%M%S')
            bdir = os.path.join(BACKUP_DIR, now)
            os.makedirs(bdir, exist_ok=True)
            files_backed = []
            for fname in ['local-meals.json', 'nutrition-data.js', 'index.html']:
                src = os.path.join(DATA_DIR, fname)
                if os.path.exists(src):
                    shutil.copy2(src, os.path.join(bdir, fname))
                    files_backed.append(fname)
            json_response(self, {"ok": True, "backup": now, "files": files_backed})

        elif self.path == '/api/add-food':
            food = read_body(self)
            # Insert new food entry into FOOD_DATABASE in nutrition-data.js
            js_path = os.path.join(DATA_DIR, 'nutrition-data.js')
            with open(js_path, 'r') as f:
                content = f.read()
            # Build JS entry
            per100g = food.get('per100g', {})
            ingredients = food.get('ingredients', [])
            ing_comment = '  // Ingredients: ' + ', '.join(
                f"{i['name']} ({i['grams']}g)" for i in ingredients
            ) + '\n' if ingredients else ''
            entry = (
                f'{ing_comment}'
                f'  {{\n'
                f'    id: "{food["id"]}",\n'
                f'    name: "{food["name"]}",\n'
                f'    brand: "Recetario",\n'
                f'    per100g: {{ kcal: {per100g.get("kcal", 0)}, prot: {per100g.get("prot", 0)}, '
                f'carbs: {per100g.get("carbs", 0)}, fat: {per100g.get("fat", 0)}, '
                f'fiber: {per100g.get("fiber", 0)} }},\n'
                f'    totalG: {food.get("totalG", 0)},\n'
                f'    source: "recetario",\n'
                f'    addedDate: "{food.get("addedDate", datetime.now().strftime("%Y-%m-%d"))}"\n'
                f'  }},'
            )
            # Insert after "=== RECETARIO ===" section header, or after first [
            marker = '// === RECETARIO ==='
            idx = content.find(marker)
            if idx >= 0:
                insert_pos = content.index('\n', idx) + 1
                content = content[:insert_pos] + entry + '\n' + content[insert_pos:]
            else:
                bracket = content.index('const FOOD_DATABASE = [') + len('const FOOD_DATABASE = [')
                content = content[:bracket] + '\n' + entry + content[bracket:]
            with open(js_path, 'w') as f:
                f.write(content)
            json_response(self, {"ok": True, "id": food["id"]})

        elif self.path == '/api/delete-meal':
            body = read_body(self)  # {id: "xxx"}
            data = load_local()
            data["meals"] = [m for m in data["meals"] if m.get("id") != body["id"]]
            save_local(data)
            json_response(self, {"ok": True})

        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        if '/api/' in (args[0] if args else ''):
            super().log_message(format, *args)


if __name__ == '__main__':
    os.chdir(DATA_DIR)
    server = HTTPServer(('0.0.0.0', 8090), NutrIAHandler)
    print('NutrIA server running on http://0.0.0.0:8090')
    server.serve_forever()
