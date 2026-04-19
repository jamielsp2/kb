<?php
/**
 * Atlas KB — Full Reset + Fresh Setup (SQLite)
 * Wipes ALL content and re-creates the schema with a fresh admin account.
 *
 * ⚠️  DELETE OR PROTECT THIS FILE in production after first run!
 * Access: https://yourdomain.com/api/reset.php
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

try {
    $pdo = getDB();

    // ── Drop all tables in safe order ─────────────────────────────────────
    $pdo->exec('PRAGMA foreign_keys = OFF');
    foreach (['article_tags', 'recent_views', 'favorites', 'articles', 'folders', 'tags', 'categories', 'users'] as $t) {
        $pdo->exec("DROP TABLE IF EXISTS \"$t\"");
    }
    $pdo->exec('PRAGMA foreign_keys = ON');

    // ── Users ─────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE users (
        id            TEXT    PRIMARY KEY,
        name          TEXT    NOT NULL,
        email         TEXT    NOT NULL UNIQUE,
        password_hash TEXT    NOT NULL,
        role          TEXT    NOT NULL DEFAULT 'viewer' CHECK(role IN ('admin','collaborator','viewer')),
        initials      TEXT    DEFAULT 'US',
        color         TEXT    DEFAULT 'oklch(0.72 0.15 255)',
        active        INTEGER NOT NULL DEFAULT 1,
        last_login    TEXT    NULL,
        created_at    TEXT    DEFAULT (datetime('now'))
    )");

    // ── Categories ────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE categories (
        id         TEXT    PRIMARY KEY,
        name       TEXT    NOT NULL,
        icon       TEXT    DEFAULT 'folder',
        sort_order INTEGER DEFAULT 0,
        created_at TEXT    DEFAULT (datetime('now'))
    )");

    // ── Folders ───────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE folders (
        id                 TEXT    PRIMARY KEY,
        name               TEXT    NOT NULL,
        parent_category_id TEXT,
        sort_order         INTEGER DEFAULT 0,
        created_at         TEXT    DEFAULT (datetime('now')),
        FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE CASCADE
    )");

    // ── Tags ─────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE tags (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT    NOT NULL UNIQUE,
        created_at TEXT    DEFAULT (datetime('now'))
    )");

    // ── Articles ──────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE articles (
        id              TEXT    PRIMARY KEY,
        title           TEXT    NOT NULL,
        subtitle        TEXT,
        content_md      TEXT    NOT NULL,
        category_id     TEXT,
        folder_id       TEXT,
        read_time       TEXT    DEFAULT '5 min',
        version         TEXT    DEFAULT 'v1.0',
        author_name     TEXT    DEFAULT 'Admin',
        author_initials TEXT    DEFAULT 'AD',
        author_color    TEXT    DEFAULT 'oklch(0.72 0.15 255)',
        created_by      TEXT,
        created_at      TEXT    DEFAULT (datetime('now')),
        updated_at      TEXT    DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (folder_id)   REFERENCES folders(id)    ON DELETE SET NULL
    )");

    // Auto-update updated_at on article change
    $pdo->exec("CREATE TRIGGER articles_updated_at
        AFTER UPDATE ON articles
        FOR EACH ROW
        BEGIN
            UPDATE articles SET updated_at = datetime('now') WHERE id = OLD.id;
        END
    ");

    // ── Article-Tag pivot ─────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE article_tags (
        article_id TEXT    NOT NULL,
        tag_id     INTEGER NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id)     REFERENCES tags(id)     ON DELETE CASCADE
    )");

    // ── Favorites ─────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE favorites (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT,
        article_id TEXT    NOT NULL,
        pinned     INTEGER DEFAULT 0,
        note       TEXT,
        added_at   TEXT    DEFAULT (datetime('now')),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )");

    // ── Recent views ──────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE recent_views (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT,
        article_id TEXT    NOT NULL,
        progress   REAL    DEFAULT 0.0,
        viewed_at  TEXT    DEFAULT (datetime('now')),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )");

    // ── Seed default admin ────────────────────────────────────────────────
    $adminId    = 'u-admin-001';
    $adminName  = 'Administrador';
    $adminEmail = 'admin@atlas.kb';
    $adminPwd   = 'Atlas2026!';
    $adminHash  = password_hash($adminPwd, PASSWORD_DEFAULT);

    $pdo->prepare("INSERT INTO users (id, name, email, password_hash, role, initials, color)
                   VALUES (?, ?, ?, ?, 'admin', 'AD', 'oklch(0.72 0.15 255)')")
        ->execute([$adminId, $adminName, $adminEmail, $adminHash]);

    echo json_encode([
        'success' => true,
        'message' => 'Base de datos SQLite limpia y lista.',
        'db_path'  => DB_PATH,
        'admin_credentials' => [
            'email'    => $adminEmail,
            'password' => $adminPwd,
            'role'     => 'admin',
        ],
        'note' => 'Todos los artículos, categorías, carpetas y tags han sido eliminados.',
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
