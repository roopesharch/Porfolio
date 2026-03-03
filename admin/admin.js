/**
 * ADMIN LOGIC v24.0 - GOLD MASTER
 */

if (!localStorage.getItem('sb-portfolio-session')) {
    window.location.href = 'login.html';
}

const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = CONFIG.SUPABASE_ANON_KEY;

const editor = document.getElementById('json-textarea');
const formHelper = document.getElementById('form-helper');
const formContent = document.getElementById('form-content');
const statusDiv = document.getElementById('status');
const userDisplay = document.getElementById('user-display');

let masterData = {};
let targetID = null;

function getSession() {
    const sessionStr = localStorage.getItem('sb-portfolio-session');
    if (!sessionStr) { window.location.href = 'login.html'; return null; }
    return JSON.parse(sessionStr);
}

async function loadData() {
    const session = getSession();
    if (!session) return;
    
    userDisplay.textContent = `Admin: ${session.user.email}`;
    showStatus("Fetching Cloud Data...", "#6366f1");
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_metadata?select=*&limit=1`, {
            headers: { 
                'apikey': SUPABASE_ANON_KEY, 
                'Authorization': `Bearer ${session.access_token}` 
            }
        });
        
        if (!response.ok) throw new Error("Connection failed");

        const result = await response.json();

        if (result && result.length > 0) {
            targetID = result[0].id; 
            masterData = result[0].content;
            editor.value = JSON.stringify(masterData, null, 4);
            showStatus("Data Synced.", "#10b981");
        } else {
            editor.placeholder = "No data found in database.";
        }
    } catch (err) { 
        editor.placeholder = "Error loading data. Check console.";
        showStatus("Fetch Error: " + err.message, "#ef4444"); 
    }
}

function formatJson() {
    const rawValue = editor.value;
    if (!rawValue.trim()) return false;
    try {
        masterData = JSON.parse(rawValue);
        editor.value = JSON.stringify(masterData, null, 4);
        editor.style.borderColor = "#334155"; 
        showStatus("JSON Valid", "#10b981");
        return true;
    } catch (e) {
        const errorMsg = e.message;
        const posMatch = errorMsg.match(/position\s+(\d+)/);
        if (posMatch) {
            const pos = parseInt(posMatch[1]);
            editor.focus();
            editor.setSelectionRange(pos, pos + 1);
            editor.style.borderColor = "#ef4444";
            showStatus(`Syntax Error at pos ${pos}`, "#ef4444");
        }
        return false;
    }
}

async function saveData() {
    const session = getSession();
    if (!session) return;
    if (!formatJson()) return; 

    showStatus("Syncing with Supabase...", "#6366f1");

    try {
        const urlSuffix = targetID ? `?id=eq.${targetID}` : '';
        const response = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_metadata${urlSuffix}`, {
            method: targetID ? 'PATCH' : 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ 
                content: masterData,
                category: 'master_data' 
            })
        });

        if (response.ok) {
            showStatus("Database Updated!", "#10b981");
        } else {
            const errJson = await response.json();
            throw new Error(errJson.message || "RLS Security Blocked this update.");
        }
    } catch (err) { 
        showStatus("Save Failed: " + err.message, "#ef4444");
    }
}

function buildFormView(data, container, path = []) {
    if (path.length === 0) container.innerHTML = '';
    Object.keys(data).forEach(key => {
        const value = data[key];
        const currentPath = [...path, key];
        const group = document.createElement('div');
        group.className = 'form-group';
        const label = document.createElement('label');
        label.textContent = key.toUpperCase();
        group.appendChild(label);
        if (Array.isArray(value)) {
            const listWrap = document.createElement('div');
            value.forEach((item, i) => {
                const input = document.createElement('input');
                input.value = typeof item === 'object' ? JSON.stringify(item) : item;
                input.oninput = (e) => { 
                    value[i] = e.target.value; 
                    editor.value = JSON.stringify(masterData, null, 4); 
                };
                listWrap.appendChild(input);
            });
            group.appendChild(listWrap);
        } else if (typeof value === 'object' && value !== null) {
            const sub = document.createElement('div');
            group.appendChild(sub);
            buildFormView(value, sub, currentPath);
        } else {
            const input = value.toString().length > 50 ? document.createElement('textarea') : document.createElement('input');
            input.value = value;
            input.oninput = (e) => {
                let obj = masterData;
                for(let i=0; i<currentPath.length-1; i++) obj = obj[currentPath[i]];
                obj[currentPath[currentPath.length-1]] = e.target.value;
                editor.value = JSON.stringify(masterData, null, 4);
            };
            group.appendChild(input);
        }
        container.appendChild(group);
    });
}

document.getElementById('view-code').onclick = function() {
    this.classList.add('active');
    document.getElementById('view-form').classList.remove('active');
    editor.style.display = 'block';
    formHelper.style.display = 'none';
};

document.getElementById('view-form').onclick = function() {
    if (formatJson()) {
        this.classList.add('active');
        document.getElementById('view-code').classList.remove('active');
        editor.style.display = 'none';
        formHelper.style.display = 'block';
        buildFormView(masterData, formContent);
    }
};

function showStatus(msg, color) {
    statusDiv.textContent = msg;
    statusDiv.style.display = 'block';
    statusDiv.style.background = color;
    if (window.statusTimeout) clearTimeout(window.statusTimeout);
    window.statusTimeout = setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
}

document.getElementById('logout-btn').onclick = () => { 
    localStorage.clear(); 
    window.location.href = 'login.html'; 
};
document.getElementById('format-btn').onclick = formatJson;
document.getElementById('save-btn').onclick = saveData;
document.addEventListener('DOMContentLoaded', loadData);