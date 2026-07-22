<?php
/**
 * Atlas KB — Auth API
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
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}


$action = $_GET['action'] ?? '';

// ── helpers ────────────────────────────────────────────────────────────────
function requireAuth($pdo) {
    if (empty($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['error' => 'unauthenticated']);
        exit;
    }
}

function requireAdmin($pdo) {
    requireAuth($pdo);
    if ($_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'admin only']);
        exit;
    }
}

// ── actions ─────────────────────────────────────────────────────────────────
switch ($action) {

    // Check current session
    case 'me':
        if (!empty($_SESSION['user'])) {
            $u = $_SESSION['user'];
            // Refresh from DB
            $stmt = $pdo->prepare("SELECT id, name, email, role, initials, color FROM users WHERE id = ? AND active = 1");
            $stmt->execute([$u['id']]);
            $row = $stmt->fetch();
            if ($row) {
                $_SESSION['user'] = $row;
                echo json_encode(['authenticated' => true, 'user' => $row]);
            } else {
                session_destroy();
                echo json_encode(['authenticated' => false]);
            }
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;

    // Login
    case 'login':
        $data  = json_decode(file_get_contents('php://input'), true);
        $email = trim($data['email'] ?? '');
        $pwd   = $data['password'] ?? '';

        if (!$email || !$pwd) {
            http_response_code(400);
            echo json_encode(['error' => 'Email y contraseña requeridos.']);
            break;
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($pwd, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales incorrectas.']);
            break;
        }

        // Update last login timestamp
        $pdo->prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?")->execute([$user['id']]);

        $session = [
            'id'       => $user['id'],
            'name'     => $user['name'],
            'email'    => $user['email'],
            'role'     => $user['role'],
            'initials' => $user['initials'],
            'color'    => $user['color'],
        ];
        $_SESSION['user'] = $session;

        echo json_encode(['success' => true, 'user' => $session]);
        break;

    // Logout
    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    // Change password
    case 'change_password':
        requireAuth($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        $current = $data['current_password'] ?? '';
        $new     = $data['new_password'] ?? '';

        if (!$current || !$new) {
            http_response_code(400);
            echo json_encode(['error' => 'La contraseña actual y la nueva son requeridas.']);
            break;
        }
        
        $userId = $_SESSION['user']['id'];
        $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($current, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'La contraseña actual es incorrecta.']);
            break;
        }
        
        $newHash = password_hash($new, PASSWORD_DEFAULT);
        $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$newHash, $userId]);
        
        echo json_encode(['success' => true]);
        break;

    // List users (admin only)
    case 'users':
        requireAdmin($pdo);
        $stmt = $pdo->query("SELECT id, name, email, role, initials, color, active, last_login, created_at FROM users ORDER BY role, name");
        echo json_encode($stmt->fetchAll());
        break;

    // Create user (admin only)
    case 'create_user':
        requireAdmin($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        $name  = trim($data['name']  ?? '');
        $email = trim($data['email'] ?? '');
        $pwd   = $data['password']   ?? '';
        $role  = $data['role']       ?? 'viewer';

        if (!$name || !$email || !$pwd) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre, email y contraseña son requeridos.']);
            break;
        }
        if (!in_array($role, ['admin', 'collaborator', 'viewer'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Rol inválido.']);
            break;
        }
        // Check duplicate email
        $chk = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $chk->execute([$email]);
        if ($chk->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Ese email ya está registrado.']);
            break;
        }

        // Initials from name
        $parts    = explode(' ', $name);
        $initials = strtoupper(substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
        // Color palette
        $colors   = ['oklch(0.72 0.15 255)', 'oklch(0.72 0.15 30)', 'oklch(0.72 0.15 145)', 'oklch(0.72 0.15 320)', 'oklch(0.72 0.15 60)'];
        $color    = $colors[array_rand($colors)];

        $hash = password_hash($pwd, PASSWORD_DEFAULT);
        $id   = uniqid('u-');

        $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password_hash, role, initials, color) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $name, $email, $hash, $role, $initials, $color]);

        echo json_encode(['success' => true, 'id' => $id]);
        break;

    // Update user role / active (admin only)
    case 'update_user':
        requireAdmin($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        $id   = $data['id'] ?? '';
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'id required']); break; }

        // Prevent demoting yourself
        if ($id === $_SESSION['user']['id']) {
            http_response_code(400);
            echo json_encode(['error' => 'No puedes modificar tu propia cuenta desde aquí.']);
            break;
        }

        $fields = []; $params = [];
        foreach (['role', 'active', 'name'] as $f) {
            if (isset($data[$f])) { $fields[] = "$f = ?"; $params[] = $data[$f]; }
        }
        if (!empty($data['password'])) {
            $fields[]  = "password_hash = ?";
            $params[]  = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        if (empty($fields)) { echo json_encode(['success' => true]); break; }
        $params[] = $id;
        $pdo->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        echo json_encode(['success' => true]);
        break;

    // Delete user (admin only, can't delete self)
    case 'delete_user':
        requireAdmin($pdo);
        $id = $_GET['id'] ?? '';
        if ($id === $_SESSION['user']['id']) {
            http_response_code(400);
            echo json_encode(['error' => 'No puedes eliminarte a ti mismo.']);
            break;
        }
        $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
}
