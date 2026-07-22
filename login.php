<?php
session_start();
$basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['PHP_SELF'])), '/');
if (!empty($_SESSION['user'])) {
    header('Location: ' . $basePath . '/');
    exit;
}
?>
<html lang="es" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Knowly — Iniciar sesión</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --hue: 255;
  --accent: oklch(0.55 0.22 var(--hue));
  --accent-glow: oklch(0.55 0.22 var(--hue) / 0.4);
  --bg: oklch(0.97 0.01 var(--hue));
  --surface: rgba(255, 255, 255, 0.75);
  --surface-border: rgba(255, 255, 255, 0.5);
  --border: oklch(0.91 0.02 var(--hue));
  --text: oklch(0.15 0.03 var(--hue));
  --text-soft: oklch(0.40 0.03 var(--hue));
  --text-muted: oklch(0.55 0.02 var(--hue));
  --r: 24px;
  --shadow: 0 32px 64px rgba(0, 0, 0, 0.07), 0 8px 24px rgba(0,0,0,0.03);
}

[data-theme="dark"] {
  --bg: oklch(0.11 0.02 var(--hue));
  --surface: rgba(20, 20, 25, 0.6);
  --surface-border: rgba(255, 255, 255, 0.08);
  --border: oklch(0.25 0.02 var(--hue));
  --text: oklch(0.98 0.01 var(--hue));
  --text-soft: oklch(0.75 0.02 var(--hue));
  --text-muted: oklch(0.60 0.02 var(--hue));
  --shadow: 0 32px 64px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0,0,0,0.2);
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  transition: background 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
  overflow: hidden;
}

/* ── Animated Orbs ── */
body::before, body::after {
  content: '';
  position: absolute;
  width: 65vw; height: 65vw;
  max-width: 800px; max-height: 800px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  animation: float 18s infinite ease-in-out alternate;
  pointer-events: none;
}
body::before {
  background: radial-gradient(circle, oklch(0.75 0.15 var(--hue) / 0.5), transparent 70%);
  top: -15%; left: -15%;
}
body::after {
  background: radial-gradient(circle, oklch(0.70 0.18 calc(var(--hue) + 50) / 0.4), transparent 70%);
  bottom: -15%; right: -15%;
  animation-delay: -9s;
}
[data-theme="dark"] body::before { background: radial-gradient(circle, oklch(0.40 0.15 var(--hue) / 0.3), transparent 70%); }
[data-theme="dark"] body::after { background: radial-gradient(circle, oklch(0.35 0.18 calc(var(--hue) + 50) / 0.25), transparent 70%); }

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(8vw, 6vw) scale(1.05); }
}

.card {
  position: relative; z-index: 1;
  background: var(--surface);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid var(--surface-border);
  border-radius: var(--r);
  box-shadow: var(--shadow);
  width: 100%; max-width: 440px;
  overflow: hidden;
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp { to { transform: translateY(0); opacity: 1; } }

/* ── Header ── */
.card-header {
  padding: 44px 40px 32px;
  text-align: center;
  position: relative;
}
.brand-logo {
  width: 68px; height: 68px;
  background: linear-gradient(135deg, var(--accent), oklch(0.48 0.22 calc(var(--hue) + 30)));
  border-radius: 20px;
  display: grid; place-items: center;
  margin: 0 auto 20px;
  font-weight: 700; font-size: 30px; color: #fff;
  box-shadow: 0 12px 28px var(--accent-glow), inset 0 2px 4px rgba(255,255,255,0.2);
  position: relative;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.brand-logo:hover { transform: scale(1.08) rotate(-4deg); }

.card-title { font-family: 'Instrument Serif', serif; font-size: 34px; color: var(--text); font-weight: 400; letter-spacing: -.02em; line-height: 1.1; }
.card-sub { font-size: 14.5px; color: var(--text-soft); margin-top: 6px; }

/* ── Form ── */
.card-body { padding: 0 40px 36px; }

.form-group { margin-bottom: 22px; }
.form-label { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-soft); margin-bottom: 8px; letter-spacing: .03em; text-transform: uppercase; }

.form-input {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  color: var(--text);
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}
[data-theme="dark"] .form-input { background: rgba(0, 0, 0, 0.25); }

.form-input:focus {
  border-color: var(--accent);
  background: var(--bg);
  box-shadow: 0 0 0 4px oklch(0.55 0.22 var(--hue) / 0.12);
  transform: translateY(-2px);
}
.form-input::placeholder { color: var(--text-muted); font-weight: 400; }

.pw-wrap { position: relative; }
.pw-toggle {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--text-muted);
  padding: 6px; border-radius: 6px; display: grid; place-items: center;
  transition: all .2s ease;
}
.pw-toggle:hover { color: var(--accent); background: rgba(0,0,0,0.03); }
[data-theme="dark"] .pw-toggle:hover { background: rgba(255,255,255,0.05); }

/* ── Submit ── */
.btn-submit {
  width: 100%; padding: 15px; margin-top: 10px;
  background: linear-gradient(135deg, var(--accent), oklch(0.48 0.22 calc(var(--hue) + 20)));
  color: #fff; font-size: 16px; font-weight: 600;
  border: none; border-radius: 12px; cursor: pointer;
  font-family: inherit; letter-spacing: -.01em;
  transition: all .3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 8px 24px var(--accent-glow);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
}
.btn-submit::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}
.btn-submit:hover::after { left: 150%; }
.btn-submit:hover  { transform: translateY(-3px); box-shadow: 0 14px 32px var(--accent-glow); }
.btn-submit:active { transform: translateY(0); box-shadow: 0 4px 12px var(--accent-glow); }
.btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }

/* ── Alert ── */
.alert {
  padding: 14px 16px; border-radius: 12px; font-size: 14px; font-weight: 500;
  margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.alert-error { background: oklch(0.96 0.04 30); border: 1px solid oklch(0.85 0.09 30); color: oklch(0.38 0.14 30); }
[data-theme="dark"] .alert-error { background: oklch(0.20 0.04 30); border-color: oklch(0.35 0.09 30); color: oklch(0.88 0.14 30); }

/* ── Footer ── */
.card-foot {
  padding: 18px 40px 22px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 13px; color: var(--text-muted); font-weight: 500;
  background: rgba(0,0,0,0.015);
}
[data-theme="dark"] .card-foot { background: rgba(255,255,255,0.015); }

/* ── Theme toggle ── */
.theme-btn {
  position: fixed; top: 24px; right: 24px; z-index: 10;
  width: 48px; height: 48px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--surface); border: 1px solid var(--surface-border);
  box-shadow: var(--shadow); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  cursor: pointer; color: var(--text-soft); transition: all .4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.theme-btn:hover { color: var(--accent); transform: scale(1.15) rotate(15deg); box-shadow: 0 12px 24px var(--accent-glow); }

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
    <div class="brand-logo">K</div>
    <div class="card-title">Knowly</div>
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
    Knowly &copy; <?= date('Y') ?> &nbsp;·&nbsp; Solo personal autorizado
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
