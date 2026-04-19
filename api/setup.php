<?php
/**
 * Atlas KB — Database Setup
 * Run this once to create the database and tables.
 * Access: http://localhost/kb/api/setup.php
 */

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'atlas_kb';

header('Content-Type: application/json');

try {
    // Connect without DB first to create it
    $pdo = new PDO("mysql:host=$host", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbname`");

    // Categories
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(64) DEFAULT 'folder',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Folders
    $pdo->exec("CREATE TABLE IF NOT EXISTS folders (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parent_category_id VARCHAR(64),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE CASCADE
    )");

    // Tags
    $pdo->exec("CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Articles
    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        subtitle TEXT,
        content_md LONGTEXT NOT NULL,
        category_id VARCHAR(64),
        folder_id VARCHAR(64),
        read_time VARCHAR(20) DEFAULT '5 min',
        version VARCHAR(20) DEFAULT 'v1.0',
        author_name VARCHAR(255) DEFAULT 'Admin',
        author_initials VARCHAR(10) DEFAULT 'AD',
        author_color VARCHAR(64) DEFAULT 'oklch(0.72 0.15 255)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
    )");

    // Article-Tag pivot
    $pdo->exec("CREATE TABLE IF NOT EXISTS article_tags (
        article_id VARCHAR(64),
        tag_id INT,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )");

    // Favorites
    $pdo->exec("CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(64) NOT NULL,
        pinned TINYINT(1) DEFAULT 0,
        note TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )");

    // Recent views
    $pdo->exec("CREATE TABLE IF NOT EXISTS recent_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(64) NOT NULL,
        progress DECIMAL(3,2) DEFAULT 0.00,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )");

    // Seed default categories
    $cats = [
        ['getting-started', 'Primeros pasos', 'rocket', 0],
        ['product', 'Producto', 'box', 1],
        ['integrations', 'Integraciones', 'plug', 2],
        ['billing', 'Facturación', 'card', 3],
        ['api', 'API & Desarrollo', 'code', 4],
        ['troubleshooting', 'Solución de problemas', 'wrench', 5],
    ];
    $stmt = $pdo->prepare("INSERT IGNORE INTO categories (id, name, icon, sort_order) VALUES (?, ?, ?, ?)");
    foreach ($cats as $c) $stmt->execute($c);

    // Seed default folders
    $folders = [
        ['f-install', 'Instalación y setup', 'getting-started', 0],
        ['f-workspaces', 'Workspaces y equipos', 'getting-started', 1],
        ['f-editor', 'Editor y bloques', 'product', 0],
        ['f-publish', 'Publicar y compartir', 'product', 1],
        ['f-slack', 'Slack', 'integrations', 0],
        ['f-github', 'GitHub', 'integrations', 1],
        ['f-plans', 'Planes y precios', 'billing', 0],
        ['f-rest', 'REST API', 'api', 0],
        ['f-webhooks', 'Webhooks', 'api', 1],
        ['f-errors', 'Errores comunes', 'troubleshooting', 0],
    ];
    $stmt = $pdo->prepare("INSERT IGNORE INTO folders (id, name, parent_category_id, sort_order) VALUES (?, ?, ?, ?)");
    foreach ($folders as $f) $stmt->execute($f);

    // Seed tags
    $tagNames = ['api', 'editor', 'workspace', 'markdown', 'setup', 'integrations', 'security', 'webhooks', 'billing', 'productividad', 'seo', 'publish', 'errors', 'macos', 'windows', 'linux', 'onboarding', 'teams', 'auth', 'limits', 'pricing', 'slack', 'github'];
    $stmt = $pdo->prepare("INSERT IGNORE INTO tags (name) VALUES (?)");
    foreach ($tagNames as $t) $stmt->execute([$t]);

    // Seed one demo article
    $demoContent = "# Escribir en Markdown: bloques, atajos y el editor de Atlas\n\nAtlas usa **Markdown estándar** (CommonMark) con un conjunto cuidado de extensiones: callouts, bloques de código con resaltado, tablas, checklists y embeds nativos de vídeo e imagen.\n\n## Resumen rápido\n\nSi ya sabes Markdown *ya sabes Atlas* — solo hay un par de sorpresas agradables.\n\n> **Importa lo que ya tienes.** Arrastra una carpeta con archivos `.md` al editor y Atlas recreará la estructura de carpetas como árbol navegable.\n\n## Sintaxis soportada\n\nEncontrarás la mayoría de elementos habituales: encabezados, listas ordenadas y desordenadas, tablas, separadores, enlaces con título, imágenes y referencias.\n\n### Encabezados y estructura\n\nCada artículo debería empezar con un `#` (título) y organizarse en `##` para secciones principales y `###` para subtemas.\n\n### Bloques de código\n\nLos bloques de código reconocen el lenguaje y aplican resaltado automático:\n\n```javascript\n// Publica un artículo desde un archivo .md\nimport { atlas } from '@atlas/sdk';\n\nconst doc = await atlas.publish({\n  path: './guides/markdown.md',\n  folder: 'editor',\n  tags: ['markdown', 'editor'],\n});\n\nconsole.log(`Publicado: \${doc.url}`);\n```\n\n## Callouts y notas\n\nLos callouts destacan información importante. Úsalos con moderación.\n\n> Un buen artículo guía al lector de lo general a lo específico. Empieza con el *por qué*, luego el *qué*, y solo al final entra en el *cómo*.\n\n## Embeds e imágenes\n\nArrastra imágenes directamente al editor, o pega URLs de vídeo de YouTube, Loom o Vimeo.\n\n## Atajos de teclado\n\nLos atajos más usados en el editor:\n\n- `⌘ + B` — Negrita\n- `⌘ + I` — Cursiva\n- `⌘ + K` — Insertar enlace\n- `⌘ + ⇧ + C` — Bloque de código\n- `/` — Abrir menú slash con todos los bloques\n\n## Importar desde .md\n\nSi ya tienes una base de conocimiento en Markdown — en un repo de GitHub, en Obsidian, o en una carpeta local — puedes importarla completa. Atlas detecta frontmatter YAML, convierte wikilinks `[[así]]` en enlaces internos, y preserva tu estructura de carpetas como árbol de navegación.";

    $stmt = $pdo->prepare("INSERT IGNORE INTO articles (id, title, subtitle, content_md, category_id, folder_id, read_time, version, author_name, author_initials, author_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        'a-blocks',
        'Escribir en Markdown: bloques, atajos y el editor de Atlas',
        'Todo lo que necesitas saber para escribir contenido estructurado en Atlas usando sintaxis Markdown estándar con extensiones para callouts, embeds y bloques de código.',
        $demoContent,
        'product',
        'f-editor',
        '6 min',
        'v3.2',
        'Lucía Méndez',
        'LM',
        'oklch(0.72 0.15 30)'
    ]);

    // Add tags for demo article
    $tagStmt = $pdo->prepare("SELECT id FROM tags WHERE name = ?");
    $pivotStmt = $pdo->prepare("INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)");
    foreach (['editor', 'markdown', 'productividad'] as $t) {
        $tagStmt->execute([$t]);
        $row = $tagStmt->fetch(PDO::FETCH_ASSOC);
        if ($row) $pivotStmt->execute(['a-blocks', $row['id']]);
    }

    echo json_encode(['success' => true, 'message' => 'Database atlas_kb created and seeded successfully!']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
