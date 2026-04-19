<?php
// =============================================
// Atlas KB — Database Setup & Seed
// Run once: http://localhost/kb/setup.php
// =============================================

$host   = 'localhost';
$user   = 'root';
$pass   = '';
$dbName = 'atlas_kb';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName`
        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbName`");

    // --- SCHEMA ---
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id   INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50)  DEFAULT 'folder',
        slug VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS folders (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name        VARCHAR(100) NOT NULL,
        slug        VARCHAR(100),
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        folder_id  INT NOT NULL,
        title      VARCHAR(255) NOT NULL,
        subtitle   TEXT,
        content_md LONGTEXT,
        slug       VARCHAR(255),
        read_time  VARCHAR(20) DEFAULT '5 min',
        version    VARCHAR(20) DEFAULT 'v1.0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tags (
        id   INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS article_tags (
        article_id INT NOT NULL,
        tag_id     INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id)     REFERENCES tags(id)     ON DELETE CASCADE
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS article_authors (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        name       VARCHAR(100) NOT NULL,
        initials   VARCHAR(5),
        color      VARCHAR(100),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS favorites (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL UNIQUE,
        note       TEXT,
        pinned     TINYINT DEFAULT 0,
        added_at   VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS reading_history (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL UNIQUE,
        progress   FLOAT DEFAULT 0,
        viewed_at  VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");

    echo "<p>✅ Tablas creadas.</p>";

    // --- SEED (only if empty) ---
    $count = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($count > 0) {
        echo "<p>⚠️ Ya hay datos — seed omitido.</p>";
        echo '<p><a href="/">← Ir a Atlas</a></p>';
        exit;
    }

    // Categories
    $cats = [
        ['name' => 'Primeros pasos',           'icon' => 'rocket',  'slug' => 'getting-started'],
        ['name' => 'Producto',                  'icon' => 'box',     'slug' => 'product'],
        ['name' => 'Integraciones',             'icon' => 'plug',    'slug' => 'integrations'],
        ['name' => 'Facturación',               'icon' => 'card',    'slug' => 'billing'],
        ['name' => 'API & Desarrollo',          'icon' => 'code',    'slug' => 'api'],
        ['name' => 'Solución de problemas',     'icon' => 'wrench',  'slug' => 'troubleshooting'],
    ];
    $insC = $pdo->prepare("INSERT INTO categories (name, icon, slug) VALUES (?, ?, ?)");
    $catIds = [];
    foreach ($cats as $c) {
        $insC->execute([$c['name'], $c['icon'], $c['slug']]);
        $catIds[$c['slug']] = $pdo->lastInsertId();
    }

    // Folders
    $folds = [
        ['cat' => 'getting-started', 'name' => 'Instalación y setup'],
        ['cat' => 'getting-started', 'name' => 'Workspaces y equipos'],
        ['cat' => 'product',         'name' => 'Editor y bloques'],
        ['cat' => 'product',         'name' => 'Publicar y compartir'],
        ['cat' => 'integrations',    'name' => 'Slack'],
        ['cat' => 'integrations',    'name' => 'GitHub'],
        ['cat' => 'billing',         'name' => 'Planes y precios'],
        ['cat' => 'api',             'name' => 'REST API'],
        ['cat' => 'api',             'name' => 'Webhooks'],
        ['cat' => 'troubleshooting', 'name' => 'Errores comunes'],
    ];
    $insF = $pdo->prepare("INSERT INTO folders (category_id, name, slug) VALUES (?, ?, ?)");
    $folderIds = [];
    foreach ($folds as $f) {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $f['name']));
        $insF->execute([$catIds[$f['cat']], $f['name'], $slug]);
        $folderIds[$f['name']] = $pdo->lastInsertId();
    }

    // Tags
    $tagList = ['api','editor','workspace','markdown','setup','integrations','security','webhooks','billing','errors','github','slack'];
    $insT = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");
    $tagIds = [];
    foreach ($tagList as $t) {
        $insT->execute([$t, $t]);
        $tagIds[$t] = $pdo->lastInsertId();
    }

    // Helper: attach tags to article
    $insAT = $pdo->prepare("INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)");
    $insAA = $pdo->prepare("INSERT INTO article_authors (article_id, name, initials, color) VALUES (?, ?, ?, ?)");
    $insAr = $pdo->prepare("INSERT INTO articles (folder_id, title, subtitle, content_md, slug, read_time, version) VALUES (?, ?, ?, ?, ?, ?, ?)");

    function addArticle($pdo, $insAr, $insAT, $insAA, $tagIds, $folderId, $title, $subtitle, $content, $tags, $authors = [], $readTime = '5 min', $version = 'v1.0') {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $title));
        $insAr->execute([$folderId, $title, $subtitle, $content, $slug, $readTime, $version]);
        $aId = $pdo->lastInsertId();
        foreach ($tags as $t) {
            if (isset($tagIds[$t])) $insAT->execute([$aId, $tagIds[$t]]);
        }
        foreach ($authors as $a) {
            $insAA->execute([$aId, $a['name'], $a['initials'], $a['color']]);
        }
        return $aId;
    }

    $sampleContent = <<<MD
# Escribir en Markdown: bloques, atajos y el editor de Atlas

## Resumen rápido

Atlas usa **Markdown estándar** (CommonMark) con un conjunto cuidado de extensiones: callouts, bloques de código con resaltado, tablas, checklists y embeds nativos de vídeo e imagen. Si ya sabes Markdown *ya sabes Atlas* — solo hay un par de sorpresas agradables.

> Importa lo que ya tienes. Arrastra una carpeta con archivos `.md` al editor y Atlas recreará la estructura de carpetas como árbol navegable, preservando frontmatter y enlaces cruzados.

## Sintaxis soportada

Encontrarás la mayoría de elementos habituales: encabezados, listas ordenadas y desordenadas, tablas, separadores, enlaces con título, imágenes y referencias. Lo importante en un portal de conocimiento es que **la jerarquía sea clara**, así que presta atención al orden de tus `##` y `###`.

### Encabezados y estructura

Cada artículo debería empezar con un `#` (título) y organizarse en `##` para secciones principales y `###` para subtemas. Atlas genera automáticamente la tabla de contenidos a la derecha.

### Bloques de código

Los bloques de código reconocen el lenguaje y aplican resaltado automático:

```javascript
// Publica un artículo desde un archivo .md
import { atlas } from '@atlas/sdk';

const doc = await atlas.publish({
  path: './guides/markdown.md',
  folder: 'editor',
  tags: ['markdown', 'editor'],
});

console.log(`Publicado: \${doc.url}`);
```

## Callouts y notas

Los callouts destacan información importante. Úsalos con moderación — un callout cada pocos párrafos es perfecto. Demasiados y pierden impacto.

> Un buen artículo guía al lector de lo general a lo específico. Empieza con el *por qué*, luego el *qué*, y solo al final entra en el *cómo*.

## Atajos de teclado

Los atajos más usados en el editor:

- `⌘ + B` — Negrita
- `⌘ + I` — Cursiva
- `⌘ + K` — Insertar enlace
- `⌘ + ⇧ + C` — Bloque de código
- `/` — Abrir menú slash con todos los bloques

## Importar desde .md

Si ya tienes una base de conocimiento en Markdown — en un repo de GitHub, en Obsidian, o en una carpeta local — puedes importarla completa. Atlas detecta frontmatter YAML, convierte wikilinks `[[así]]` en enlaces internos, y preserva tu estructura de carpetas como árbol de navegación.
MD;

    $authors = [
        ['name' => 'Lucía Méndez', 'initials' => 'LM', 'color' => 'oklch(0.72 0.15 30)'],
        ['name' => 'David Ortiz',  'initials' => 'DO', 'color' => 'oklch(0.68 0.17 200)'],
        ['name' => 'Noa Keller',   'initials' => 'NK', 'color' => 'oklch(0.7 0.15 320)'],
    ];

    addArticle($pdo, $insAr, $insAT, $insAA, $tagIds,
        $folderIds['Editor y bloques'],
        'Escribir en Markdown: bloques, atajos y el editor de Atlas',
        'Todo lo que necesitas saber para escribir contenido estructurado en Atlas usando sintaxis Markdown estándar con extensiones para callouts, embeds y bloques de código.',
        $sampleContent,
        ['editor','markdown'],
        $authors, '6 min', 'v3.2');

    addArticle($pdo, $insAr, $insAT, $insAA, $tagIds,
        $folderIds['Instalación y setup'],
        'Instalar Atlas en macOS',
        'Guía paso a paso para instalar y configurar Atlas en macOS.',
        "# Instalar Atlas en macOS\n\nEsta guía cubre la instalación en **macOS 12+**.\n\n## Requisitos\n\n- macOS 12 Monterey o superior\n- Node.js 18+\n\n## Pasos\n\n1. Descarga el instalador desde la web oficial\n2. Abre el archivo `.dmg`\n3. Arrastra Atlas a Aplicaciones\n4. Abre Atlas desde Launchpad\n\n## Primera configuración\n\nAl abrir Atlas por primera vez se te pedirá crear un workspace. Elige un nombre y pulsa **Continuar**.",
        ['setup'], [['name' => 'Equipo Atlas', 'initials' => 'EA', 'color' => 'oklch(0.6 0.15 250)']], '3 min');

    addArticle($pdo, $insAr, $insAT, $insAA, $tagIds,
        $folderIds['Workspaces y equipos'],
        'Invitar colaboradores al workspace',
        'Aprende a añadir miembros a tu workspace y gestionar sus permisos.',
        "# Invitar colaboradores\n\n## Enviar invitaciones\n\nVe a **Ajustes → Equipo** y pulsa **Invitar miembro**. Introduce el email y selecciona el rol.\n\n## Roles disponibles\n\n| Rol | Puede leer | Puede editar | Puede administrar |\n|-----|-----------|-------------|------------------|\n| Lector | ✅ | ❌ | ❌ |\n| Editor | ✅ | ✅ | ❌ |\n| Admin | ✅ | ✅ | ✅ |\n\n## Gestionar acceso\n\nDesde **Ajustes → Equipo** puedes cambiar roles o revocar acceso en cualquier momento.",
        ['workspace'], [['name' => 'Lucía Méndez', 'initials' => 'LM', 'color' => 'oklch(0.72 0.15 30)']], '4 min');

    addArticle($pdo, $insAr, $insAT, $insAA, $tagIds,
        $folderIds['REST API'],
        'Autenticación con tokens',
        'Cómo generar y usar tokens de API para autenticar tus peticiones.',
        "# Autenticación con tokens\n\nAtlas usa **tokens Bearer** para autenticar peticiones a la API.\n\n## Generar un token\n\n1. Ve a **Ajustes → API**\n2. Pulsa **Nuevo token**\n3. Dale un nombre descriptivo\n4. Copia el token (no se volverá a mostrar)\n\n## Usar el token\n\n```bash\ncurl https://api.atlas.app/v1/articles \\\n  -H \"Authorization: Bearer TU_TOKEN\"\n```\n\n## Seguridad\n\n- Nunca compartas tu token\n- Rótalo periódicamente\n- Usa variables de entorno en tu código\n\n```python\nimport os\ntoken = os.environ.get('ATLAS_TOKEN')\n```",
        ['api','security'], [['name' => 'David Ortiz', 'initials' => 'DO', 'color' => 'oklch(0.68 0.17 200)']], '5 min');

    addArticle($pdo, $insAr, $insAT, $insAA, $tagIds,
        $folderIds['Webhooks'],
        'Configurar webhooks entrantes',
        'Recibe notificaciones en tiempo real cuando ocurran eventos en Atlas.',
        "# Configurar webhooks entrantes\n\n## ¿Qué son los webhooks?\n\nLos webhooks permiten que Atlas notifique a tu sistema cuando ocurren eventos, como la publicación de un artículo.\n\n## Configuración\n\n1. Ve a **Ajustes → Integraciones → Webhooks**\n2. Pulsa **Añadir endpoint**\n3. Introduce la URL de tu servidor\n4. Selecciona los eventos a escuchar\n\n## Eventos disponibles\n\n```json\n{\n  \"event\": \"article.published\",\n  \"data\": {\n    \"id\": 123,\n    \"title\": \"Mi artículo\",\n    \"url\": \"https://docs.example.com/mi-articulo\"\n  }\n}\n```\n\n## Verificar la firma\n\nCada petición incluye el header `X-Atlas-Signature` para verificar la autenticidad.",
        ['api','webhooks'], [['name' => 'Noa Keller', 'initials' => 'NK', 'color' => 'oklch(0.7 0.15 320)']], '6 min');

    addArticle($pdo, $insAr, $insAT, $insAA, $tagIds,
        $folderIds['Errores comunes'],
        'Error 401: token inválido',
        'Cómo diagnosticar y resolver errores de autenticación en la API.',
        "# Error 401: token inválido\n\n## Causas habituales\n\n- El token fue revocado desde **Ajustes → API**\n- El header `Authorization` tiene un formato incorrecto\n- El token expiró (si configuraste expiración)\n\n## Diagnóstico\n\n```bash\n# Comprueba que el header es correcto\ncurl -v https://api.atlas.app/v1/me \\\n  -H \"Authorization: Bearer TU_TOKEN\"\n```\n\nBusca en la respuesta:\n\n```json\n{\n  \"error\": \"invalid_token\",\n  \"message\": \"The token has been revoked\"\n}\n```\n\n## Solución\n\n1. Genera un nuevo token en **Ajustes → API → Nuevo token**\n2. Actualiza tu variable de entorno `ATLAS_TOKEN`\n3. Reinicia tu aplicación",
        ['errors','api'], [['name' => 'Equipo Atlas', 'initials' => 'EA', 'color' => 'oklch(0.6 0.15 250)']], '3 min');

    echo "<p>✅ Datos de ejemplo insertados.</p>";
    echo '<p style="font-size:18px; font-weight:600;"><a href="/">← Ir a Atlas</a></p>';

} catch (Exception $e) {
    echo "<h2>❌ Error</h2><pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}
