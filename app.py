#!/usr/bin/env python3
"""
DevForge - Developer Tools Hub Backend
Flask API for code snippets, saved tools, and admin panel.
Usage: python3 app.py
"""

from flask import Flask, request, jsonify, send_from_directory
import json, os, uuid, hashlib, datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def load(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return []

def save(filename, data):
    with open(os.path.join(DATA_DIR, filename), 'w') as f:
        json.dump(data, f, indent=2)

if not os.path.exists(os.path.join(DATA_DIR, 'snippets.json')):
    save('snippets.json', [
        {'id': str(uuid.uuid4()), 'title': 'Python Binary Search', 'language': 'python', 'code': 'def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1', 'author': 'Mayank', 'created': datetime.datetime.now().isoformat()},
        {'id': str(uuid.uuid4()), 'title': 'Bash Process Monitor', 'language': 'bash', 'code': '#!/bin/bash\n# Monitor a process by name\nPROCESS="nginx"\nwhile true; do\n    if pgrep "$PROCESS" > /dev/null; then\n        echo "$(date): $PROCESS is running ($(pgrep -c "$PROCESS") instances)"\n    else\n        echo "$(date): $PROCESS is NOT running"\n    fi\n    sleep 5\ndone', 'author': 'Mayank', 'created': datetime.datetime.now().isoformat()},
        {'id': str(uuid.uuid4()), 'title': 'SQL CTE Example', 'language': 'sql', 'code': 'WITH ranked_sales AS (\n    SELECT \n        product_id,\n        sale_amount,\n        RANK() OVER (ORDER BY sale_amount DESC) as rank\n    FROM sales\n    WHERE sale_date >= CURRENT_DATE - INTERVAL \'30 days\'\n)\nSELECT * FROM ranked_sales WHERE rank <= 10;', 'author': 'Mayank', 'created': datetime.datetime.now().isoformat()},
    ])

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/login.html')
def login():
    return '''<!DOCTYPE html><html><head><title>DevForge Login</title><link rel="stylesheet" href="/static/css/style.css"><style>body{background:var(--bg);color:var(--text)}</style></head><body style="display:flex;align-items:center;justify-content:center;min-height:100vh">
<div class="card" style="max-width:400px;width:90%"><h2 style="text-align:center;margin-bottom:1.5rem">⚡ DevForge Login</h2>
<form onsubmit="event.preventDefault();login()">
<div class="form-group"><label>Email</label><input type="email" id="email" value="dev@example.com" required></div>
<div class="form-group"><label>Password</label><input type="password" id="password" value="password" required></div>
<button type="submit" class="btn btn-primary" style="width:100%">Login</button></form></div>
<script>function login(){localStorage.setItem('devforge_user',JSON.stringify({name:'Developer',email:document.getElementById('email').value}));window.location.href='/'}</script></body></html>'''

# ── Snippets API ──
@app.route('/api/snippets', methods=['GET'])
def get_snippets():
    return jsonify(load('snippets.json'))

@app.route('/api/snippets', methods=['POST'])
def create_snippet():
    s = request.json
    s['id'] = str(uuid.uuid4())
    s['created'] = datetime.datetime.now().isoformat()
    snippets = load('snippets.json')
    snippets.append(s)
    save('snippets.json', snippets)
    return jsonify(s), 201

@app.route('/api/snippets/<sid>', methods=['DELETE'])
def delete_snippet(sid):
    snippets = [s for s in load('snippets.json') if s['id'] != sid]
    save('snippets.json', snippets)
    return '', 204

# ── Server-side hash (secure) ──
@app.route('/api/hash', methods=['POST'])
def server_hash():
    data = request.json.get('text', '')
    algo = request.json.get('algo', 'sha256')
    if algo == 'md5':
        return jsonify({'hash': hashlib.md5(data.encode()).hexdigest()})
    elif algo == 'sha1':
        return jsonify({'hash': hashlib.sha1(data.encode()).hexdigest()})
    elif algo == 'sha512':
        return jsonify({'hash': hashlib.sha512(data.encode()).hexdigest()})
    return jsonify({'hash': hashlib.sha256(data.encode()).hexdigest()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"⚡ DevForge running at http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
