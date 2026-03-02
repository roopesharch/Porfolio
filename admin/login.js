const SUPABASE_URL = 'https://irkywlnfizmlzkltbepk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlya3l3bG5maXptbHprbHRiZXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjM1ODIsImV4cCI6MjA4ODAzOTU4Mn0.10xYnVeD4SEdvpoCs9-ZU1cJRv8iCGLt5ELgbSWoFXE';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('unlock-btn');
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    btn.textContent = "Verifying...";
    btn.disabled = true;

    try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error_description || "Auth Failed");

        localStorage.setItem('sb-portfolio-session', JSON.stringify(data));
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message);
        btn.textContent = "Unlock Vault";
        btn.disabled = false;
    }
});