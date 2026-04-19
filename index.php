<?php
session_start();
if (empty($_SESSION['user'])) {
    $loginUrl = rtrim(dirname($_SERVER['PHP_SELF']), '/') . '/login.php';
    header('Location: ' . $loginUrl);
    exit;
}

// Dynamic base path — works under /kb/ (XAMPP) or / (Docker/Coolify)
$basePath = rtrim(dirname($_SERVER['PHP_SELF']), '/');
$v = @filemtime(__FILE__) ?: '1';
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Atlas — Base de Conocimiento</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= $basePath ?>/styles.css">
<link rel="stylesheet" href="<?= $basePath ?>/views.css">
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>

<script>
// Injected by PHP — available to all JSX files
window.__ATLAS_BASE__ = <?= json_encode($basePath) ?>;
window.__ATLAS_USER__ = <?= json_encode([
    'id'       => $_SESSION['user']['id'],
    'name'     => $_SESSION['user']['name'],
    'email'    => $_SESSION['user']['email'],
    'role'     => $_SESSION['user']['role'],
    'initials' => $_SESSION['user']['initials'],
    'color'    => $_SESSION['user']['color'],
]) ?>;
</script>
</head>
<body>
<div id="root"></div>

<script type="text/babel" src="<?= $basePath ?>/data.jsx?v=<?= $v ?>"></script>
<script type="text/babel" src="<?= $basePath ?>/components.jsx?v=<?= $v ?>"></script>
<script type="text/babel" src="<?= $basePath ?>/views.jsx?v=<?= $v ?>"></script>
<script type="text/babel" src="<?= $basePath ?>/article.jsx?v=<?= $v ?>"></script>
<script type="text/babel" src="<?= $basePath ?>/manage.jsx?v=<?= $v ?>"></script>
<script type="text/babel" src="<?= $basePath ?>/users.jsx?v=<?= $v ?>"></script>
<script type="text/babel" src="<?= $basePath ?>/app.jsx?v=<?= $v ?>"></script>
</body>
</html>

