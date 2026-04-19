<?php
/**
 * Atlas KB — REST API (auth-protected)
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}


$action = $_GET['action'] ?? '';

// ── Auth guard ───────────────────────────────────────────────────────────────
$readOnlyActions  = ['articles','article','categories','folders','tags','all_tags','stats'];
$writeActions     = ['create_article','update_article','delete_article','create_category','delete_category','create_folder','delete_folder','create_tag','delete_tag'];

$currentUser = $_SESSION['user'] ?? null;

// All actions require authentication
if (!$currentUser) {
    http_response_code(401);
    echo json_encode(['error' => 'unauthenticated']);
    exit;
}

// Write actions require admin or collaborator
if (in_array($action, $writeActions) && !in_array($currentUser['role'], ['admin','collaborator'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Solo administradores y colaboradores pueden crear o modificar contenido.']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {

    // ==================== ARTICLES ====================
    case 'articles':
        $stmt = $pdo->query("
            SELECT a.*, c.name as category_name, c.icon as category_icon,
                   f.name as folder_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN folders f ON a.folder_id = f.id
            ORDER BY a.updated_at DESC
        ");
        $articles = $stmt->fetchAll();

        // Attach tags to each article
        $tagStmt = $pdo->prepare("
            SELECT t.name FROM article_tags at
            JOIN tags t ON at.tag_id = t.id
            WHERE at.article_id = ?
        ");
        foreach ($articles as &$a) {
            $tagStmt->execute([$a['id']]);
            $a['tags'] = array_column($tagStmt->fetchAll(), 'name');
        }

        echo json_encode($articles);
        break;

    case 'article':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("
            SELECT a.*, c.name as category_name, c.icon as category_icon,
                   f.name as folder_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN folders f ON a.folder_id = f.id
            WHERE a.id = ?
        ");
        $stmt->execute([$id]);
        $article = $stmt->fetch();
        if (!$article) {
            http_response_code(404);
            echo json_encode(['error' => 'Article not found']);
            break;
        }
        $tagStmt = $pdo->prepare("SELECT t.name FROM article_tags at JOIN tags t ON at.tag_id = t.id WHERE at.article_id = ?");
        $tagStmt->execute([$id]);
        $article['tags'] = array_column($tagStmt->fetchAll(), 'name');
        echo json_encode($article);
        break;

    case 'create_article':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['title']) || empty($data['content_md'])) {
            http_response_code(400);
            echo json_encode(['error' => 'title and content_md are required']);
            break;
        }

        $id = 'a-' . substr(md5(uniqid()), 0, 12);
        $wordCount = str_word_count(strip_tags($data['content_md']));
        $readTime  = max(1, round($wordCount / 200)) . ' min';

        // Use session user for authorship
        $authorName     = $currentUser['name']     ?? ($data['author_name']     ?? 'Admin');
        $authorInitials = $currentUser['initials'] ?? ($data['author_initials'] ?? 'AD');
        $authorColor    = $currentUser['color']    ?? 'oklch(0.72 0.15 255)';
        $createdBy      = $currentUser['id']       ?? null;

        $stmt = $pdo->prepare("INSERT INTO articles
            (id, title, subtitle, content_md, category_id, folder_id, read_time,
             author_name, author_initials, author_color, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['title'],
            $data['subtitle'] ?? '',
            $data['content_md'],
            $data['category_id'] ?? null,
            $data['folder_id']   ?? null,
            $readTime,
            $authorName,
            $authorInitials,
            $authorColor,
            $createdBy,
        ]);

        // Handle tags
        if (!empty($data['tags']) && is_array($data['tags'])) {
            foreach ($data['tags'] as $tagName) {
                $tagName = trim($tagName);
                if (!$tagName) continue;
                $pdo->prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)")->execute([$tagName]);
                $tagRow = $pdo->prepare("SELECT id FROM tags WHERE name = ?");
                $tagRow->execute([$tagName]);
                $tagId = $tagRow->fetchColumn();
                if ($tagId) {
                    $pdo->prepare("INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)")->execute([$id, $tagId]);
                }
            }
        }

        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'update_article':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'id is required']);
            break;
        }
        // Ownership check: must be admin OR the original creator
        $ownerCheck = $pdo->prepare("SELECT created_by FROM articles WHERE id = ?");
        $ownerCheck->execute([$data['id']]);
        $ownerRow = $ownerCheck->fetch();
        if (!$ownerRow) { http_response_code(404); echo json_encode(['error' => 'Article not found']); break; }
        if ($currentUser['role'] !== 'admin' && $ownerRow['created_by'] !== $currentUser['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Solo puedes editar artículos que tú mismo hayas creado.']);
            break;
        }

        $fields = []; $params = [];
        foreach (['title', 'subtitle', 'content_md', 'category_id', 'folder_id'] as $f) {
            if (isset($data[$f])) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
        }
        $params[] = $data['id'];
        $pdo->prepare("UPDATE articles SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

        // Update tags if provided
        if (isset($data['tags']) && is_array($data['tags'])) {
            $pdo->prepare("DELETE FROM article_tags WHERE article_id = ?")->execute([$data['id']]);
            foreach ($data['tags'] as $tagName) {
                $tagName = trim($tagName);
                if (!$tagName) continue;
                $pdo->prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)")->execute([$tagName]);
                $tagRow = $pdo->prepare("SELECT id FROM tags WHERE name = ?");
                $tagRow->execute([$tagName]);
                $tagId = $tagRow->fetchColumn();
                if ($tagId) {
                    $pdo->prepare("INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)")->execute([$data['id'], $tagId]);
                }
            }
        }

        echo json_encode(['success' => true]);
        break;

    case 'delete_article':
        $id = $_GET['id'] ?? '';
        // Ownership check
        $ownerCheck = $pdo->prepare("SELECT created_by FROM articles WHERE id = ?");
        $ownerCheck->execute([$id]);
        $ownerRow = $ownerCheck->fetch();
        if (!$ownerRow) { http_response_code(404); echo json_encode(['error' => 'Article not found']); break; }
        if ($currentUser['role'] !== 'admin' && $ownerRow['created_by'] !== $currentUser['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Solo puedes eliminar artículos que tú mismo hayas creado.']);
            break;
        }
        $pdo->prepare("DELETE FROM articles WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    // ==================== CATEGORIES ====================
    case 'categories':
        $stmt = $pdo->query("SELECT c.*, (SELECT COUNT(*) FROM articles a WHERE a.category_id = c.id) as article_count FROM categories c ORDER BY sort_order");
        echo json_encode($stmt->fetchAll());
        break;

    case 'create_category':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) { http_response_code(400); echo json_encode(['error' => 'name required']); break; }
        $base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $data['name']));
        $id = $base;
        // Ensure unique ID
        $check = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
        $check->execute([$id]);
        if ($check->fetch()) $id = $base . '-' . substr(md5(uniqid()), 0, 4);
        $stmt = $pdo->prepare("INSERT INTO categories (id, name, icon, sort_order) VALUES (?, ?, ?, ?)");
        $stmt->execute([$id, $data['name'], $data['icon'] ?? 'folder', $data['sort_order'] ?? 99]);
        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'delete_category':
        $id = $_GET['id'] ?? '';
        // Nullify articles in this category before deleting
        $pdo->prepare("UPDATE articles SET category_id = NULL, folder_id = NULL WHERE category_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM folders WHERE parent_category_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    // ==================== FOLDERS ====================
    case 'folders':
        $categoryId = $_GET['category_id'] ?? null;
        if ($categoryId) {
            $stmt = $pdo->prepare("SELECT f.*, (SELECT COUNT(*) FROM articles a WHERE a.folder_id = f.id) as article_count FROM folders f WHERE f.parent_category_id = ? ORDER BY sort_order");
            $stmt->execute([$categoryId]);
        } else {
            $stmt = $pdo->query("SELECT f.*, c.name as category_name FROM folders f LEFT JOIN categories c ON f.parent_category_id = c.id ORDER BY f.parent_category_id, f.sort_order");
        }
        echo json_encode($stmt->fetchAll());
        break;

    case 'create_folder':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) { http_response_code(400); echo json_encode(['error' => 'name required']); break; }
        $base = 'f-' . strtolower(preg_replace('/[^a-z0-9]+/i', '-', $data['name']));
        $id = $base;
        $check = $pdo->prepare("SELECT id FROM folders WHERE id = ?");
        $check->execute([$id]);
        if ($check->fetch()) $id = $base . '-' . substr(md5(uniqid()), 0, 4);
        $stmt = $pdo->prepare("INSERT INTO folders (id, name, parent_category_id, sort_order) VALUES (?, ?, ?, ?)");
        $stmt->execute([$id, $data['name'], $data['parent_category_id'] ?: null, $data['sort_order'] ?? 99]);
        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'delete_folder':
        $id = $_GET['id'] ?? '';
        $pdo->prepare("UPDATE articles SET folder_id = NULL WHERE folder_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM folders WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    // ==================== TAGS ====================
    case 'tags':
        $stmt = $pdo->query("SELECT t.id, t.name, COUNT(at.article_id) as count FROM tags t LEFT JOIN article_tags at ON t.id = at.tag_id GROUP BY t.id, t.name HAVING count > 0 ORDER BY count DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'all_tags':
        $stmt = $pdo->query("SELECT t.id, t.name, COUNT(at.article_id) as count FROM tags t LEFT JOIN article_tags at ON t.id = at.tag_id GROUP BY t.id, t.name ORDER BY t.name ASC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'create_tag':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) { http_response_code(400); echo json_encode(['error' => 'name required']); break; }
        $name = strtolower(trim($data['name']));
        $pdo->prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)")->execute([$name]);
        $id = $pdo->lastInsertId();
        if (!$id) {
            $row = $pdo->prepare("SELECT id FROM tags WHERE name = ?");
            $row->execute([$name]);
            $id = $row->fetchColumn();
        }
        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'delete_tag':
        $id = $_GET['id'] ?? '';
        $pdo->prepare("DELETE FROM article_tags WHERE tag_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM tags WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    // ==================== STATS ====================
    case 'stats':
        $articleCount  = $pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
        $categoryCount = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        $folderCount   = $pdo->query("SELECT COUNT(*) FROM folders")->fetchColumn();
        $tagCount      = $pdo->query("SELECT COUNT(DISTINCT t.id) FROM tags t JOIN article_tags at ON t.id = at.tag_id")->fetchColumn();
        $lastUpdated   = $pdo->query("SELECT MAX(updated_at) FROM articles")->fetchColumn();
        echo json_encode([
            'articles'   => (int)$articleCount,
            'categories' => (int)$categoryCount,
            'folders'    => (int)$folderCount,
            'tags'       => (int)$tagCount,
            'last_updated' => $lastUpdated ?: 'Never'
        ]);
        break;

    default:
        echo json_encode(['error' => 'Unknown action', 'available' => [
            'articles','article','create_article','update_article','delete_article',
            'categories','create_category','delete_category',
            'folders','create_folder','delete_folder',
            'tags','all_tags','create_tag','delete_tag','stats'
        ]]);
}
