#!/bin/bash
# NutrIA - Local server for WiFi access
# Run this and access from any device on your network

PORT=8090
IP=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")

echo ""
echo "  NutrIA Server"
echo "  ─────────────────────────────"
echo "  Local:   http://localhost:$PORT"
echo "  WiFi:    http://$IP:$PORT"
echo "  ─────────────────────────────"
echo "  Open the WiFi link from your phone or tablet"
echo "  Press Ctrl+C to stop"
echo ""

cd ~/Desktop/NutrIA
python3 -m http.server $PORT --bind 0.0.0.0
