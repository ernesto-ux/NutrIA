#!/usr/bin/env python3
"""
Export NutrIA meals to CSV for Apple Health import.
Uses format compatible with "Health Importer" iOS app (by Stefan Church).

Usage:
  python3 export-apple-health.py                  # Export from today
  python3 export-apple-health.py 2026-04-08       # Export from specific date
  python3 export-apple-health.py 2026-04-01 2026-04-07  # Date range
"""

import json
import re
import sys
import csv
import os
import subprocess
from datetime import datetime, date

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MEALS_FILE = os.path.join(SCRIPT_DIR, "local-meals.json")
DATA_FILE = os.path.join(SCRIPT_DIR, "nutrition-data.js")
OUTPUT_DIR = os.path.expanduser("~/Downloads")
GITHUB_REPO = "ernesto-ux/NutrIA"

HEALTH_TYPES = {
    "kcal": "HKQuantityTypeIdentifierDietaryEnergyConsumed",
    "prot": "HKQuantityTypeIdentifierDietaryProtein",
    "carbs": "HKQuantityTypeIdentifierDietaryCarbohydrates",
    "fat": "HKQuantityTypeIdentifierDietaryFatTotal",
}

UNITS = {
    "kcal": "kcal",
    "prot": "g",
    "carbs": "g",
    "fat": "g",
}


def parse_meal_log_js(js_content):
    """Parse MEAL_LOG from nutrition-data.js (JS object notation, not strict JSON)."""
    match = re.search(r'const MEAL_LOG\s*=\s*\[(.*?)\];', js_content, re.DOTALL)
    if not match:
        return []

    block = match.group(1)
    # Convert JS object notation to JSON: add quotes to keys
    block = re.sub(r'(\s)(\w+)\s*:', r'\1"\2":', block)
    # Remove trailing commas before ] or }
    block = re.sub(r',\s*([}\]])', r'\1', block)
    # Remove JS comments
    block = re.sub(r'//[^\n]*', '', block)

    try:
        return json.loads(f"[{block}]")
    except json.JSONDecodeError:
        return []


def load_meals_from_js(filepath, from_date, to_date=None):
    """Load Ernesto's meals from nutrition-data.js MEAL_LOG."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        content = f.read()

    all_meals = parse_meal_log_js(content)
    meals = []
    for meal in all_meals:
        user = meal.get("user", "")
        # MEAL_LOG entries without user field after Ernesto section header are Ernesto's
        meal_id = meal.get("id", "")
        is_ernesto = (user == "ernesto") or (not user and not meal_id.endswith(("-A01", "-A02", "-A03", "-A04", "-A05", "-A06", "-A07", "-A08", "-A09", "-A10")))
        # More reliable: check if ID contains -A (Adriana) pattern
        if "-A" in meal_id and meal_id.split("-A")[-1].isdigit():
            is_ernesto = False
        elif meal_id and re.match(r'.*-\d{3}$', meal_id):
            is_ernesto = True

        if not is_ernesto:
            continue
        if meal["date"] < from_date:
            continue
        if to_date and meal["date"] > to_date:
            continue
        meals.append(meal)

    return meals


def fetch_github_data():
    """Fetch nutrition-data.js from GitHub and save to temp file."""
    try:
        result = subprocess.run(
            ["gh", "api", f"repos/{GITHUB_REPO}/contents/nutrition-data.js", "--jq", ".content"],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode == 0 and result.stdout.strip():
            import base64
            content = base64.b64decode(result.stdout.strip()).decode("utf-8")
            tmp_path = "/tmp/nutria-github-data.js"
            with open(tmp_path, "w") as f:
                f.write(content)
            return tmp_path
    except Exception:
        pass
    return None


def load_meals(from_date, to_date=None, use_github=False):
    """Load meals from all sources, dedup by ID."""
    seen_ids = set()
    meals = []

    # Source 1: GitHub nutrition-data.js (freshest if requested)
    if use_github:
        print("Fetching latest data from GitHub...")
        gh_path = fetch_github_data()
        if gh_path:
            for m in load_meals_from_js(gh_path, from_date, to_date):
                mid = m.get("id", "")
                if mid not in seen_ids:
                    seen_ids.add(mid)
                    meals.append(m)
            print(f"  Found {len(meals)} meals from GitHub")

    # Source 2: Local nutrition-data.js
    for m in load_meals_from_js(DATA_FILE, from_date, to_date):
        mid = m.get("id", "")
        if mid not in seen_ids:
            seen_ids.add(mid)
            meals.append(m)

    # Source 3: local-meals.json
    if os.path.exists(MEALS_FILE):
        with open(MEALS_FILE, "r") as f:
            data = json.load(f)
        overrides = data.get("overrides", {})
        for meal in data["meals"]:
            if meal.get("user") != "ernesto":
                continue
            if meal["date"] < from_date:
                continue
            if to_date and meal["date"] > to_date:
                continue
            meal_id = meal.get("id", "")
            if overrides.get(meal_id) == "deleted":
                continue
            if meal_id in overrides and isinstance(overrides[meal_id], list):
                meal["items"] = overrides[meal_id]
            if meal_id not in seen_ids:
                seen_ids.add(meal_id)
                meals.append(meal)

    return sorted(meals, key=lambda m: m.get("timestamp", m["date"]))


def aggregate_by_meal(meals):
    """Aggregate items per meal entry into one row with totals."""
    results = []
    for meal in meals:
        totals = {"kcal": 0, "prot": 0, "carbs": 0, "fat": 0}
        for item in meal.get("items", []):
            for key in totals:
                totals[key] += item.get(key, 0)

        ts = meal.get("timestamp", meal["date"] + "T12:00:00.000Z")
        results.append({
            "date": meal["date"],
            "meal": meal.get("meal", "snack"),
            "timestamp": ts,
            "totals": totals,
        })
    return results


def write_csv(aggregated, output_path):
    """Write CSV in Health Importer format: Type, Start Date, Value, Unit."""
    rows = []
    for entry in aggregated:
        ts = entry["timestamp"].replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(ts)
        except ValueError:
            dt = datetime.fromisoformat(entry["date"] + "T12:00:00+00:00")

        start = dt.strftime("%Y-%m-%d %H:%M")

        for macro, health_type in HEALTH_TYPES.items():
            value = round(entry["totals"][macro], 1)
            if value > 0:
                rows.append({
                    "Type": health_type,
                    "Start Date": start,
                    "Value": value,
                    "Unit": UNITS[macro],
                })

    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["Type", "Start Date", "Value", "Unit"])
        writer.writeheader()
        writer.writerows(rows)

    return len(rows)


def main():
    today = date.today().isoformat()

    use_github = "--github" in sys.argv or "-g" in sys.argv
    # Remove flags from argv for date parsing
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    from_date = args[0] if len(args) > 0 else today
    to_date = args[1] if len(args) > 1 else None

    meals = load_meals(from_date, to_date, use_github=use_github)
    if not meals:
        print(f"No meals found for Ernesto from {from_date}" +
              (f" to {to_date}" if to_date else "") + ".")
        print("Log your meals in NutrIA first, then run this again.")
        return

    aggregated = aggregate_by_meal(meals)

    label = from_date
    if to_date:
        label += f"_to_{to_date}"
    output_path = os.path.join(OUTPUT_DIR, f"nutria-health-export-{label}.csv")

    row_count = write_csv(aggregated, output_path)

    meal_count = len(aggregated)
    date_range = sorted(set(e["date"] for e in aggregated))
    print(f"Exported {meal_count} meals ({row_count} Health records)")
    print(f"Dates: {date_range[0]} to {date_range[-1]}")
    print(f"File: {output_path}")
    print()
    print("Next steps:")
    print("1. AirDrop or iCloud the CSV to your iPhone")
    print('2. Open "Health Importer" app → Import CSV')
    print("3. MFP will sync automatically from Apple Health")


if __name__ == "__main__":
    main()
