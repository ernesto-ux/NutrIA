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
            source = food.get('source', 'recetario')
            brand = food.get('brand', 'Recetario')
            author = food.get('author', '')
            author_line = f'    author: "{author}",\n' if author else ''
            entry = (
                f'{ing_comment}'
                f'  {{\n'
                f'    id: "{food["id"]}",\n'
                f'    name: "{food["name"]}",\n'
                f'    brand: "{brand}",\n'
                f'    per100g: {{ kcal: {per100g.get("kcal", 0)}, prot: {per100g.get("prot", 0)}, '
                f'carbs: {per100g.get("carbs", 0)}, fat: {per100g.get("fat", 0)}, '
                f'fiber: {per100g.get("fiber", 0)} }},\n'
                f'    totalG: {food.get("totalG", 0)},\n'
                f'{author_line}'
                f'    source: "{source}",\n'
                f'    addedDate: "{food.get("addedDate", datetime.now().strftime("%Y-%m-%d"))}"\n'
                f'  }},'
            )
            # Insert in appropriate section
            if source == 'manual':
                # Manual dishes go right after opening bracket
                bracket = content.index('const FOOD_DATABASE = [') + len('const FOOD_DATABASE = [')
                content = content[:bracket] + '\n' + entry + content[bracket:]
            else:
                # Recipes go after "=== RECETARIO ===" section header
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

        elif self.path == '/api/activity':
            # Save activity data (steps, gym) to nutrition-data.js ACTIVITY_LOG
            body = read_body(self)  # {date, steps, stepsKcal, gym, gymKcal, notes}
            js_path = os.path.join(DATA_DIR, 'nutrition-data.js')
            with open(js_path, 'r') as f:
                content = f.read()
            date = body.get('date', '')
            # Check if entry for this date exists
            import re
            pattern = rf'(\{{[^}}]*date:\s*"{re.escape(date)}"[^}}]*\}})'
            match = re.search(pattern, content[content.find('const ACTIVITY_LOG'):content.find('const DAILY_BALANCE')])
            entry = (
                f'  {{ date: "{date}", steps: {body.get("steps", 0)}, '
                f'stepsKcal: {body.get("stepsKcal", 0)}, '
                f'gym: {json.dumps(body.get("gym"))}, '
                f'gymKcal: {body.get("gymKcal", 0)}, '
                f'notes: "{body.get("notes", "")}" }}'
            )
            if match:
                content = content[:content.find('const ACTIVITY_LOG') + match.start()] + entry + content[content.find('const ACTIVITY_LOG') + match.end():]
            else:
                # Append before closing ];
                idx = content.find('const ACTIVITY_LOG')
                end_bracket = content.find('];', idx)
                content = content[:end_bracket] + ',\n' + entry + '\n' + content[end_bracket:]
            with open(js_path, 'w') as f:
                f.write(content)
            json_response(self, {"ok": True})

        elif self.path == '/api/weight':
            # Save weight entry to nutrition-data.js WEIGHT_LOG
            body = read_body(self)
            js_path = os.path.join(DATA_DIR, 'nutrition-data.js')
            with open(js_path, 'r') as f:
                content = f.read()
            date = body.get('date', '')
            import re
            fields = ['weight', 'bmi', 'bodyFat', 'fatFreeWeight', 'subcutFat',
                       'visceralFat', 'bodyWater', 'skeletalMuscle', 'muscleMass',
                       'boneMass', 'bmr', 'metabolicAge']
            def fmt(v):
                return 'null' if v is None else str(v)
            entry_lines = [f'    date: "{date}"']
            for f in fields:
                entry_lines.append(f'    {f}: {fmt(body.get(f))}')
            entry_lines.append(f'    source: "{body.get("source", "manual")}"')
            entry_lines.append(f'    notes: "{body.get("notes", "")}"')
            entry = '  {\n' + ',\n'.join(entry_lines) + '\n  }'
            # Check if date exists
            wlog_start = content.find('const WEIGHT_LOG')
            wlog_end = content.find('];', wlog_start)
            pattern = rf'\{{[^}}]*date:\s*"{re.escape(date)}"[^}}]*\}}'
            match = re.search(pattern, content[wlog_start:wlog_end])
            if match:
                content = content[:wlog_start + match.start()] + entry + content[wlog_start + match.end():]
            else:
                content = content[:wlog_end] + ',\n' + entry + '\n' + content[wlog_end:]
            with open(js_path, 'w') as f:
                f.write(content)
            json_response(self, {"ok": True})

        elif self.path == '/api/delete-food':
            body = read_body(self)  # {id: "food-id"}
            food_id = body.get('id', '')
            js_path = os.path.join(DATA_DIR, 'nutrition-data.js')
            with open(js_path, 'r') as f:
                content = f.read()
            import re
            # Find the food entry block: optional comment line + { ... id: "food-id" ... },
            # Pattern matches optional ingredient comment + the object block
            comment_pattern = rf'(  // Ingredients:[^\n]*\n)?  \{{[^}}]*id:\s*"{re.escape(food_id)}"[^}}]*\}},?\n?'
            new_content = re.sub(comment_pattern, '', content, count=1)
            if new_content != content:
                with open(js_path, 'w') as f:
                    f.write(new_content)
                # Also remove from in-memory FOOD_DATABASE (client will reload)
                json_response(self, {"ok": True, "id": food_id})
            else:
                json_response(self, {"ok": False, "error": "Food not found"}, 404)

        elif self.path == '/api/edit-food':
            body = read_body(self)  # {id, name, brand, per100g: {kcal, prot, carbs, fat, fiber}, totalG}
            food_id = body.get('id', '')
            js_path = os.path.join(DATA_DIR, 'nutrition-data.js')
            with open(js_path, 'r') as f:
                content = f.read()
            import re
            # Find the food entry block
            pattern = rf'(  // Ingredients:[^\n]*\n)?  \{{[^}}]*id:\s*"{re.escape(food_id)}"[^}}]*\}},?'
            match = re.search(pattern, content)
            if match:
                old_block = match.group(0)
                # Parse existing entry to preserve fields we don't update
                per100g = body.get('per100g', {})
                name = body.get('name', food_id)
                brand = body.get('brand', 'Recetario')
                source = body.get('source', 'verified')
                totalG = body.get('totalG', 0)
                author = body.get('author', '')
                author_line = f'    author: "{author}",\n' if author else ''
                # Preserve ingredient comment if present
                comment = match.group(1) or ''
                new_entry = (
                    f'{comment}  {{\n'
                    f'    id: "{food_id}",\n'
                    f'    name: "{name}",\n'
                    f'    brand: "{brand}",\n'
                    f'    per100g: {{ kcal: {per100g.get("kcal", 0)}, prot: {per100g.get("prot", 0)}, '
                    f'carbs: {per100g.get("carbs", 0)}, fat: {per100g.get("fat", 0)}, '
                    f'fiber: {per100g.get("fiber", 0)} }},\n'
                    f'    totalG: {totalG},\n'
                    f'{author_line}'
                    f'    source: "{source}",\n'
                    f'    addedDate: "{body.get("addedDate", datetime.now().strftime("%Y-%m-%d"))}"\n'
                    f'  }},'
                )
                content = content[:match.start()] + new_entry + content[match.end():]
                with open(js_path, 'w') as f:
                    f.write(content)
                json_response(self, {"ok": True, "id": food_id})
            else:
                json_response(self, {"ok": False, "error": "Food not found"}, 404)

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
