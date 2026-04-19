<?php
session_start();
$basePath = rtrim(dirname($_SERVER['PHP_SELF']), '/');
if (!empty($_SESSION['user'])) {
    header('Location: ' . $basePath . '/');
    exit;
}
?>
<html lang="es" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Atlas Knowledge — Iniciar sesión</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --hue: 255;
  --accent: oklch(0.50 0.19 var(--hue));
  --accent-soft: oklch(0.96 0.04 var(--hue));
  --bg: oklch(0.98 0.005 var(--hue));
  --surface: oklch(1 0 0);
  --border: oklch(0.91 0.01 var(--hue));
  --text: oklch(0.18 0.02 var(--hue));
  --text-soft: oklch(0.45 0.03 var(--hue));
  --text-muted: oklch(0.62 0.02 var(--hue));
  --r: 14px;
  --shadow: 0 20px 60px oklch(0.18 0.05 var(--hue) / 0.12), 0 4px 16px oklch(0.18 0.05 var(--hue) / 0.06);
}

[data-theme="dark"] {
  --bg: oklch(0.13 0.015 var(--hue));
  --surface: oklch(0.18 0.015 var(--hue));
  --border: oklch(0.28 0.02 var(--hue));
  --text: oklch(0.96 0.005 var(--hue));
  --text-soft: oklch(0.72 0.02 var(--hue));
  --text-muted: oklch(0.56 0.02 var(--hue));
  --accent-soft: oklch(0.25 0.06 var(--hue));
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  transition: background .3s, color .3s;
}

/* ── Background decoration ── */
body::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, oklch(0.85 0.08 var(--hue) / 0.25) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 85%, oklch(0.80 0.10 calc(var(--hue) + 40)) / 0.15) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.card {
  position: relative; z-index: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow);
  width: 100%; max-width: 420px;
  overflow: hidden;
}

/* ── Header stripe ── */
.card-header {
  background: linear-gradient(135deg,
    oklch(0.48 0.20 var(--hue)),
    oklch(0.42 0.18 calc(var(--hue) + 30)));
  padding: 32px 36px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.card-header::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.brand-logo {
  width: 52px; height: 52px;
  background: rgba(255,255,255,0.2);
  border-radius: 14px;
  display: grid; place-items: center;
  margin: 0 auto 14px;
  font-weight: 700; font-size: 22px; color: #fff;
  border: 1.5px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  position: relative;
}
.card-title   { font-family: 'Instrument Serif', serif; font-size: 24px; color: #fff; font-weight: 400; letter-spacing: -.02em; }
.card-sub     { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }

/* ── Form ── */
.card-body { padding: 28px 36px 32px; }

.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-soft); margin-bottom: 6px; letter-spacing: .02em; text-transform: uppercase; }

.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  transition: border-color .15s, box-shadow .15s;
  outline: none;
}
.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(0.50 0.19 var(--hue) / 0.12);
}
.form-input::placeholder { color: var(--text-muted); }

.pw-wrap { position: relative; }
.pw-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--text-muted);
  padding: 4px; border-radius: 4px; display: grid; place-items: center;
  transition: color .12s;
}
.pw-toggle:hover { color: var(--accent); }

/* ── Submit ── */
.btn-submit {
  width: 100%; padding: 12px;
  background: linear-gradient(135deg,
    oklch(0.48 0.20 var(--hue)),
    oklch(0.44 0.18 calc(var(--hue) + 20)));
  color: #fff; font-size: 15px; font-weight: 600;
  border: none; border-radius: 10px; cursor: pointer;
  font-family: inherit; letter-spacing: -.01em;
  transition: opacity .15s, transform .1s, box-shadow .15s;
  box-shadow: 0 4px 16px oklch(0.48 0.20 var(--hue) / 0.35);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-submit:hover  { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 24px oklch(0.48 0.20 var(--hue) / 0.4); }
.btn-submit:active { transform: translateY(0); }
.btn-submit:disabled { opacity: .55; cursor: not-allowed; transform: none; }

/* ── Alert ── */
.alert {
  padding: 11px 14px; border-radius: 9px; font-size: 13.5px;
  margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
}
.alert-error {
  background: oklch(0.96 0.04 30);
  border: 1px solid oklch(0.85 0.09 30);
  color: oklch(0.38 0.14 30);
}

/* ── Footer ── */
.card-foot {
  padding: 14px 36px 18px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 12px; color: var(--text-muted);
}

/* ── Theme toggle ── */
.theme-btn {
  position: fixed; top: 18px; right: 18px; z-index: 10;
  width: 36px; height: 36px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--surface); border: 1px solid var(--border);
  cursor: pointer; color: var(--text-soft); transition: all .2s;
}
.theme-btn:hover { color: var(--accent); border-color: var(--accent); }

/* ── Loading spinner ── */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; display: inline-block; }

</style>
</head>
<body>

<button class="theme-btn" id="themeBtn" title="Cambiar tema" onclick="toggleTheme()">
  <svg id="themeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
  </svg>
</button>

<div class="card">
  <!-- Header -->
  <div class="card-header">
    <div class="brand-logo">A</div>
    <div class="card-title">Atlas Knowledge</div>
    <div class="card-sub">Base de conocimiento del equipo</div>
  </div>

  <!-- Body -->
  <div class="card-body">
    <div id="alert" class="alert alert-error" style="display:none"></div>

    <form id="loginForm" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label class="form-label" for="email">Correo electrónico</label>
        <input
          type="email" id="email" name="email"
          class="form-input" required autocomplete="email"
          placeholder="tu@empresa.com"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Contraseña</label>
        <div class="pw-wrap">
          <input
            type="password" id="password" name="password"
            class="form-input" required autocomplete="current-password"
            placeholder="••••••••"
            style="padding-right: 42px"
          />
          <button type="button" class="pw-toggle" onclick="togglePw()" title="Mostrar contraseña">
            <svg id="eyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <button type="submit" class="btn-submit" id="submitBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
        </svg>
        Iniciar sesión
      </button>
    </form>
  </div>

  <div class="card-foot">
    Atlas Knowledge &copy; <?= date('Y') ?> &nbsp;·&nbsp; Solo personal autorizado
  </div>
</div>

<script>
const AUTH_API = '<?= $basePath ?>/api/auth.php';

// Check if already logged in
fetch(AUTH_API + '?action=me', { credentials: 'include' })
  .then(r => r.json())
  .then(d => { if (d.authenticated) window.location.replace('<?= $basePath ?>/'); })
  .catch(() => {});

async function handleLogin(e) {
  e.preventDefault();
  const btn   = document.getElementById('submitBtn');
  const alert = document.getElementById('alert');
  const email = document.getElementById('email').value;
  const pwd   = document.getElementById('password').value;

  btn.disabled = true;
  btn.innerHTML = '<span class="spin">⟳</span> Verificando...';
  alert.style.display = 'none';

  try {
    const res  = await fetch(AUTH_API + '?action=login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd })
    });
    const data = await res.json();

    if (data.success) {
      btn.innerHTML = '<span class="spin">⟳</span> Entrando...';
      window.location.replace('<?= $basePath ?>/');
    } else {
      showAlert(data.error || 'Error al iniciar sesión.');
    }
  } catch {
    showAlert('No se pudo conectar con el servidor. Verifica que XAMPP esté activo.');
  }

  btn.disabled = false;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg> Iniciar sesión`;
}

function showAlert(msg) {
  const el = document.getElementById('alert');
  el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h0M11 12h1v5h1"/></svg> ${msg}`;
  el.style.display = 'flex';
}

function togglePw() {
  const inp  = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.innerHTML = `<path d="M17.9 17.9A10 10 0 0 1 12 19C5 19 2 12 2 12a17 17 0 0 1 3.1-4.9M9.9 4.2A9.8 9.8 0 0 1 12 5c7 0 10 7 10 7a17 17 0 0 1-2 3.4M3 3l18 18"/><circle cx="12" cy="12" r="3"/>`;
  } else {
    inp.type = 'password';
    icon.innerHTML = `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  const icon = document.getElementById('themeIcon');
  icon.innerHTML = isDark
    ? `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`
    : `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>`;
}
</script>
</body>
</html>
