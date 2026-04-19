<?php
/**
 * Atlas KB — Database Configuration (SQLite)
 *
 * SQLite file path can be overridden via DB_PATH env var.
 * Default: <project-root>/data/atlas.db
 *
 * In Docker/Coolify, set DB_PATH to a path inside a persistent volume,
 * e.g. /data/atlas.db  (mount a Coolify volume to /data)
 */

$dbPath = getenv('DB_PATH') ?: __DIR__ . '/../data/atlas.db';
define('DB_PATH', $dbPath);

// Ensure the data directory exists and is writable
$dataDir = dirname(DB_PATH);
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0750, true);
}

/**
 * Returns a PDO SQLite connection (singleton).
 */
function getDB(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;

    $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    // Enable foreign keys (disabled by default in SQLite)
    $pdo->exec('PRAGMA foreign_keys = ON');
    // WAL mode for better concurrent reads
    $pdo->exec('PRAGMA journal_mode = WAL');

    return $pdo;
}
