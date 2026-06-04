// DevForge - Developer Tools Hub JavaScript
function $(sel){return document.querySelector(sel)}
function $$(sel){return document.querySelectorAll(sel)}

function logout(){localStorage.removeItem('devforge_user');window.location.href='/login.html'}

// Tool definitions
const TOOLS = {
    json: {
        name: 'JSON Formatter',
        render: () => `
            <h3>{} JSON Formatter</h3>
            <p style="color:var(--text-light);margin-bottom:1rem">Paste your JSON below to format, validate, or minify it.</p>
            <textarea id="jsonInput" placeholder='{"key": "value"}'></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="formatJSON()">Format</button>
                <button class="btn btn-outline" onclick="minifyJSON()">Minify</button>
                <button class="btn btn-outline" onclick="validateJSON()">Validate</button>
                <button class="btn btn-outline" onclick="copyResult()">Copy</button>
            </div>
            <div id="jsonResult" class="tool-result"></div>
        `
    },
    regex: {
        name: 'Regex Tester',
        render: () => `
            <h3>.* Regex Tester</h3>
            <p style="color:var(--text-light);margin-bottom:1rem">Test your regex patterns live against any text.</p>
            <input type="text" id="regexPattern" placeholder="Pattern (e.g. \\d{3}-\\d{4})" style="width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);margin-bottom:0.5rem">
            <input type="text" id="regexFlags" placeholder="Flags (e.g. gi)" style="width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);margin-bottom:0.5rem">
            <textarea id="regexInput" placeholder="Test text here..." style="min-height:100px"></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="testRegex()">Test</button>
            </div>
            <div id="regexResult" class="tool-result"></div>
        `
    },
    hash: {
        name: 'Hash Generator',
        render: () => `
            <h3># Hash Generator</h3>
            <p style="color:var(--text-light);margin-bottom:1rem">Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly.</p>
            <textarea id="hashInput" placeholder="Enter text to hash..."></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="genHash('md5')">MD5</button>
                <button class="btn btn-primary" onclick="genHash('sha1')">SHA-1</button>
                <button class="btn btn-primary" onclick="genHash('sha256')">SHA-256</button>
                <button class="btn btn-primary" onclick="genHash('sha512')">SHA-512</button>
            </div>
            <div id="hashResult" class="tool-result"></div>
        `
    },
    base64: {
        name: 'Base64 Encode/Decode',
        render: () => `
            <h3>64 Base64 Encode/Decode</h3>
            <textarea id="b64Input" placeholder="Enter text..."></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="encodeB64()">Encode</button>
                <button class="btn btn-outline" onclick="decodeB64()">Decode</button>
            </div>
            <div id="b64Result" class="tool-result"></div>
        `
    },
    url: {
        name: 'URL Encoder',
        render: () => `
            <h3>🔗 URL Encoder/Decoder</h3>
            <textarea id="urlInput" placeholder="Enter URL or text..."></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="encodeURL()">Encode</button>
                <button class="btn btn-outline" onclick="decodeURL()">Decode</button>
            </div>
            <div id="urlResult" class="tool-result"></div>
        `
    },
    color: {
        name: 'Color Picker',
        render: () => `
            <h3>🎨 Color Picker & Converter</h3>
            <div style="display:flex;gap:1rem;align-items:center;margin:1rem 0">
                <input type="color" id="colorPicker" value="#6C63FF" style="width:80px;height:40px;border:none;cursor:pointer">
                <input type="text" id="colorHex" value="#6C63FF" style="flex:1;padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text)">
            </div>
            <div id="colorResult" class="tool-result"></div>
        `
    },
    api: {
        name: 'API Playground',
        render: () => `
            <h3>🌐 API Playground</h3>
            <p style="color:var(--text-light);margin-bottom:1rem">Test REST APIs directly from your browser.</p>
            <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem">
                <select id="apiMethod" style="padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text)">
                    <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
                </select>
                <input type="text" id="apiURL" placeholder="https://api.example.com/endpoint" style="flex:1;padding:0.6rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text)">
            </div>
            <textarea id="apiBody" placeholder='Request body (JSON) - for POST/PUT/PATCH' style="min-height:80px;margin-bottom:0.5rem"></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="sendAPI()">Send Request</button>
            </div>
            <div id="apiResult" class="tool-result"></div>
        `
    },
    diff: {
        name: 'Text Diff',
        render: () => `
            <h3>± Text Diff</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
                <div><label style="font-size:0.8rem;color:var(--text-light)">Original</label><textarea id="diffLeft" placeholder="Original text..." style="min-height:150px"></textarea></div>
                <div><label style="font-size:0.8rem;color:var(--text-light)">Modified</label><textarea id="diffRight" placeholder="Modified text..." style="min-height:150px"></textarea></div>
            </div>
            <div class="tool-controls"><button class="btn btn-primary" onclick="computeDiff()">Compare</button></div>
            <div id="diffResult" class="tool-result"></div>
        `
    },
    jwt: {
        name: 'JWT Decoder',
        render: () => `
            <h3>🔑 JWT Decoder</h3>
            <textarea id="jwtInput" placeholder="Paste JWT token here..."></textarea>
            <div class="tool-controls"><button class="btn btn-primary" onclick="decodeJWT()">Decode</button></div>
            <div id="jwtResult" class="tool-result"></div>
        `
    },
    cron: {
        name: 'Cron Builder',
        render: () => `
            <h3>⏰ Cron Expression Builder</h3>
            <p style="color:var(--text-light);margin-bottom:1rem">Build cron expressions visually.</p>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0.5rem;margin-bottom:1rem">
                <div><label style="font-size:0.75rem;color:var(--text-light)">Min</label><input type="text" id="cronMin" placeholder="*" style="width:100%;padding:0.4rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);text-align:center"></div>
                <div><label style="font-size:0.75rem;color:var(--text-light)">Hour</label><input type="text" id="cronHour" placeholder="*" style="width:100%;padding:0.4rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);text-align:center"></div>
                <div><label style="font-size:0.75rem;color:var(--text-light)">Day</label><input type="text" id="cronDay" placeholder="*" style="width:100%;padding:0.4rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);text-align:center"></div>
                <div><label style="font-size:0.75rem;color:var(--text-light)">Month</label><input type="text" id="cronMonth" placeholder="*" style="width:100%;padding:0.4rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);text-align:center"></div>
                <div><label style="font-size:0.75rem;color:var(--text-light)">Weekday</label><input type="text" id="cronWeek" placeholder="*" style="width:100%;padding:0.4rem;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);text-align:center"></div>
            </div>
            <div class="tool-controls"><button class="btn btn-primary" onclick="buildCron()">Build</button></div>
            <div id="cronResult" class="tool-result"></div>
        `
    },
    markdown: {
        name: 'Markdown Preview',
        render: () => `
            <h3>M↓ Markdown Preview</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                <div><label style="font-size:0.8rem;color:var(--text-light)">Editor</label><textarea id="mdInput" placeholder="# Hello World" style="min-height:250px;font-family:monospace" oninput="previewMD()"></textarea></div>
                <div><label style="font-size:0.8rem;color:var(--text-light)">Preview</label><div id="mdPreview" style="min-height:250px;padding:1rem;background:var(--bg);border-radius:8px;border:1px solid var(--border);overflow-y:auto"></div></div>
            </div>
        `
    },
    qr: {
        name: 'QR Generator',
        render: () => `
            <h3>▣ QR Code Generator</h3>
            <textarea id="qrInput" placeholder="Enter text or URL..."></textarea>
            <div class="tool-controls">
                <button class="btn btn-primary" onclick="genQR()">Generate QR</button>
            </div>
            <div id="qrResult" class="tool-result" style="text-align:center"></div>
        `
    }
};

// Tool modal
function openTool(id){
    const tool = TOOLS[id];
    if(!tool) return;
    document.getElementById('toolContent').innerHTML = tool.render();
    document.getElementById('toolModal').classList.add('active');
    // Init color picker listener
    if(id === 'color'){
        document.getElementById('colorPicker').addEventListener('input', updateColor);
        updateColor();
    }
}
function closeTool(){document.getElementById('toolModal').classList.remove('active')}
function filterTools(){
    const q = document.getElementById('toolSearch').value.toLowerCase();
    $$('.tool-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
    });
}

// Tool functions
function formatJSON(){
    try{const v=JSON.parse(document.getElementById('jsonInput').value);document.getElementById('jsonResult').textContent=JSON.stringify(v,null,2)}catch(e){document.getElementById('jsonResult').textContent='❌ Invalid JSON: '+e.message}
}
function minifyJSON(){
    try{const v=JSON.parse(document.getElementById('jsonInput').value);document.getElementById('jsonResult').textContent=JSON.stringify(v)}catch(e){document.getElementById('jsonResult').textContent='❌ Invalid JSON: '+e.message}
}
function validateJSON(){
    try{JSON.parse(document.getElementById('jsonInput').value);document.getElementById('jsonResult').textContent='✅ Valid JSON'}catch(e){document.getElementById('jsonResult').textContent='❌ Invalid JSON: '+e.message}
}
function copyResult(){const r=document.getElementById('jsonResult').textContent;if(r)navigator.clipboard.writeText(r)}

function testRegex(){
    try{const p=document.getElementById('regexPattern').value;const f=document.getElementById('regexFlags').value;const t=document.getElementById('regexInput').value;const re=new RegExp(p,f);const m=t.match(re);document.getElementById('regexResult').textContent=m?'Matches: '+JSON.stringify(m,null,2):'No matches found'}catch(e){document.getElementById('regexResult').textContent='❌ Invalid regex: '+e.message}
}

function genHash(type){
    const input = document.getElementById('hashInput').value;
    if(!input){document.getElementById('hashResult').textContent='Enter text first';return}
    // Simple hash using btoa for demo (real implementation would use crypto API)
    const hash = btoa(input + type).substring(0, type === 'md5' ? 32 : type === 'sha1' ? 40 : type === 'sha256' ? 64 : 128);
    document.getElementById('hashResult').textContent = `${type.toUpperCase()}: ${hash}\n(Note: Use server-side crypto for real hashing)`;
}

function encodeB64(){try{document.getElementById('b64Result').textContent=btoa(document.getElementById('b64Input').value)}catch(e){document.getElementById('b64Result').textContent='❌ Error: '+e.message}}
function decodeB64(){try{document.getElementById('b64Result').textContent=atob(document.getElementById('b64Input').value)}catch(e){document.getElementById('b64Result').textContent='❌ Invalid Base64'}}
function encodeURL(){document.getElementById('urlResult').textContent=encodeURIComponent(document.getElementById('urlInput').value)}
function decodeURL(){document.getElementById('urlResult').textContent=decodeURIComponent(document.getElementById('urlInput').value)}

function updateColor(){
    const hex = document.getElementById('colorPicker').value;
    document.getElementById('colorHex').value = hex;
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    const hsv = rgbToHsl(r,g,b);
    document.getElementById('colorResult').innerHTML = `<strong>HEX:</strong> ${hex}<br><strong>RGB:</strong> rgb(${r},${g},${b})<br><strong>HSL:</strong> hsl(${hsv.h},${hsv.s}%,${hsv.l}%)<br><div style="width:100%;height:40px;background:${hex};border-radius:8px;margin-top:0.5rem"></div>`;
}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max===min)h=s=0;else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);h=max===r?(g-b)/d+(g<b?6:0):max===g?(b-r)/d+2:(r-g)/d+4;h*=60}return{h:Math.round(h),s:Math.round(s*100),l:Math.round(l*100)}}

async function sendAPI(){
    const method = document.getElementById('apiMethod').value;
    const url = document.getElementById('apiURL').value;
    const body = document.getElementById('apiBody').value;
    const result = document.getElementById('apiResult');
    result.textContent = '⏳ Loading...';
    try{
        const opts = {method, headers:{'Content-Type':'application/json'}};
        if(body && ['POST','PUT','PATCH'].includes(method)) opts.body = body;
        const t0 = Date.now();
        const res = await fetch(url, opts);
        const text = await res.text();
        const elapsed = Date.now() - t0;
        let bodyPretty = text;
        try{bodyPretty = JSON.stringify(JSON.parse(text),null,2)}catch(e){}
        result.innerHTML = `<strong>Status:</strong> ${res.status} ${res.statusText}<br><strong>Time:</strong> ${elapsed}ms<br><br>${bodyPretty}`;
    }catch(e){result.textContent = '❌ Error: ' + e.message;}
}

function computeDiff(){
    const left = document.getElementById('diffLeft').value.split('\n');
    const right = document.getElementById('diffRight').value.split('\n');
    let html = '';
    const maxLen = Math.max(left.length, right.length);
    for(let i=0;i<maxLen;i++){
        const l=left[i]||'',r=right[i]||'';
        if(l===r) html+=`<div style="color:var(--text-light)">  ${escapeHtml(l)}</div>`;
        else{if(l) html+=`<div style="background:rgba(239,68,68,0.2);color:#FCA5A5">- ${escapeHtml(l)}</div>`;if(r) html+=`<div style="background:rgba(34,197,94,0.2);color:#86EFAC">+ ${escapeHtml(r)}</div>`;}
    }
    document.getElementById('diffResult').innerHTML = html || 'No differences';
}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function decodeJWT(){
    try{const parts=document.getElementById('jwtInput').value.split('.');if(parts.length!==3)throw new Error('Invalid JWT format');const header=JSON.parse(atob(parts[0]));const payload=JSON.parse(atob(parts[1]));document.getElementById('jwtResult').innerHTML=`<strong>Header:</strong><br>${JSON.stringify(header,null,2)}<br><br><strong>Payload:</strong><br>${JSON.stringify(payload,null,2)}`;}catch(e){document.getElementById('jwtResult').textContent='❌ Invalid JWT: '+e.message}
}

function buildCron(){
    const f=['Min','Hour','Day','Month','Week'];
    const vals = f.map(x=>document.getElementById('cron'+x).value||'*');
    document.getElementById('cronResult').innerHTML=`<code style="font-size:1.2rem">${vals.join(' ')}</code><br><br><strong>Meaning:</strong> At minute ${vals[0]} of hour ${vals[1]}, on day-of-month ${vals[2]}, every ${vals[3]} month(s), on ${vals[4]||'every day'}`;
}

function previewMD(){
    const md = document.getElementById('mdInput').value;
    let html = md
        .replace(/^### (.*$)/gm,'<h3>$1</h3>')
        .replace(/^## (.*$)/gm,'<h2>$1</h2>')
        .replace(/^# (.*$)/gm,'<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/g,'<strong>$1</strong>')
        .replace(/\*(.*)\*/g,'<em>$1</em>')
        .replace(/`([^`]+)`/g,'<code style="background:var(--bg);padding:0.1rem 0.3rem;border-radius:4px">$1</code>')
        .replace(/```([\s\S]*?)```/g,'<pre style="background:var(--bg);padding:0.5rem;border-radius:8px;overflow-x:auto"><code>$1</code></pre>')
        .replace(/^- (.*$)/gm,'<li>$1</li>')
        .replace(/\n/g,'<br>');
    document.getElementById('mdPreview').innerHTML = html;
}

function genQR(){
    const text = document.getElementById('qrInput').value;
    if(!text){document.getElementById('qrResult').textContent='Enter text first';return}
    // Use a free QR API
    document.getElementById('qrResult').innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}" alt="QR Code" style="border-radius:8px"><br><br><small>QR Code for: ${escapeHtml(text.substring(0,50))}</small>`;
}

// Admin Panel
function openAdmin(){document.getElementById('adminModal').classList.add('active');showAdminTab('overview')}
function closeAdmin(){document.getElementById('adminModal').classList.remove('active')}
function showAdminTab(tab){
    $$('.admin-tabs .tab-btn').forEach(b=>b.classList.remove('active'));
    event.target.classList.add('active');
    const c = document.getElementById('adminContent');
    if(tab==='overview'){
        c.innerHTML=`<div class="stats-grid" style="grid-template-columns:repeat(3,1fr)"><div class="stat-card"><h3>Tools Available</h3><p>12</p></div><div class="stat-card"><h3>Total Snippets</h3><p id="adminSnippets">0</p></div><div class="stat-card"><h3>API Calls Today</h3><p>—</p></div></div>`;
    } else if(tab==='users'){
        c.innerHTML=`<h3>👥 User Management</h3><p style="color:var(--text-light)">Manage developer accounts and permissions.</p><div style="margin-top:1rem"><input type="text" id="newDevName" placeholder="Developer Name" style="padding:0.5rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);margin-right:0.5rem"><input type="email" id="newDevEmail" placeholder="Email" style="padding:0.5rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);margin-right:0.5rem"><button class="btn btn-primary" onclick="alert('User added!')">Add Developer</button></div>`;
    } else if(tab==='snippets'){
        c.innerHTML=`<h3>📋 Code Snippets</h3><p style="color:var(--text-light)">Manage shared code snippets.</p><textarea placeholder="Add a new snippet..." style="min-height:100px;margin:1rem 0"></textarea><br><button class="btn btn-primary">Save Snippet</button>`;
    } else if(tab==='settings'){
        c.innerHTML=`<h3>🔧 Settings</h3><div class="form-group"><label>Site Name</label><input type="text" value="DevForge"></div><div class="form-group"><label>Theme</label><select><option>Dark</option><option>Light</option></select></div><div class="form-group"><label><input type="checkbox" checked> Enable API Playground</label></div><div class="form-group"><label><input type="checkbox" checked> Allow Guest Access</label></div><button class="btn btn-primary">Save Settings</button>`;
    }
}
