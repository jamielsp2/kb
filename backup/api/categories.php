<?php
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') jsonResponse([]);

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

if ($method === 'GET') {
    $stmt = $db->query("
        SELECT c.id, c.name, c.icon, c.slug,
               COUNT(DISTINCT f.id)  AS folder_count,
               COUNT(DISTINCT a.id)  AS article_count
        FROM categories c
        LEFT JOIN folders  f ON f.category_id = c.id
        LEFT JOIN articles a ON a.folder_id   = f.id
        GROUP BY c.id
        ORDER BY c.id
    ");
    jsonResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $body = getBody();
    $name = trim($body['name'] ?? '');
    $icon = $body['icon'] ?? 'folder';
    if (!$name) jsonResponse(['error' => 'Name required'], 400);
    $slug = slugify($name);
    $db->prepare("INSERT INTO categories (name, icon, slug) VALUES (?, ?, ?)")
       ->execute([$name, $icon, $slug]);
    $newId = $db->lastInsertId();
    $stmt  = $db->prepare("SELECT id, name, icon, slug, 0 AS folder_count, 0 AS article_count FROM categories WHERE id = ?");
    $stmt->execute([$newId]);
    jsonResponse($stmt->fetch(), 201);
}

if ($method === 'PUT' && $id) {
    $body   = getBody();
    $fields = []; $params = [];
    foreach (['name', 'icon'] as $f) {
        if (isset($body[$f])) { $fields[] = "$f = ?"; $params[] = $body[$f]; }
    }
    if (!$fields) jsonResponse(['error' => 'Nothing to update'], 400);
    $params[] = $id;
    $db->prepare("UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['ok' => true]);
}

if ($method === 'DELETE' && $id) {
    $db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    jsonResponse(['ok' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
