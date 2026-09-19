<?php
declare(strict_types=1);

// All API routes are handled here through .htaccess rewrites.
header('Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Vary: Origin, Authorization');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_filter([
    'https://' . ($_SERVER['HTTP_HOST'] ?? ''),
    'https://www.' . ($_SERVER['HTTP_HOST'] ?? ''),
]);
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code(204);
    exit;
}

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $error, int $status = 400, ?string $message = null): never
{
    $payload = ['ok' => false, 'error' => $error];
    if ($message !== null) {
        $payload['message'] = $message;
    }
    respond($payload, $status);
}

function loadConfig(): array
{
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        fail('server_not_configured', 503, 'Create config.php from config.sample.php.');
    }
    $config = require $path;
    if (!is_array($config) || empty($config['db']) || empty($config['admin'])) {
        fail('server_not_configured', 503, 'config.php is incomplete.');
    }
    return $config;
}

function db(array $config): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    try {
        $db = $config['db'];
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $db['host'], $db['name'], $db['charset'] ?? 'utf8mb4');
        $pdo = new PDO($dsn, $db['user'], $db['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (Throwable $exception) {
        fail('database_unavailable', 503);
    }
}

function body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 32768) {
        fail('payload_too_large', 400);
    }
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data)) {
        fail('invalid_json', 400);
    }
    return $data;
}

function validText(mixed $value, int $max): bool
{
    return is_string($value) && trim($value) !== '' && mb_strlen(trim($value)) <= $max;
}

function validHttps(mixed $value): bool
{
    if (!is_string($value) || strlen($value) > 2048) {
        return false;
    }
    $parts = parse_url($value);
    return is_array($parts)
        && ($parts['scheme'] ?? '') === 'https'
        && !empty($parts['host'])
        && empty($parts['user'])
        && empty($parts['pass']);
}

function placements(mixed $value): array
{
    $allowed = ['hero_cta', 'operator_buttons', 'offer_cards', 'section_ctas', 'countdown_cta'];
    if (!is_array($value)) {
        return [];
    }
    return array_values(array_unique(array_filter($value, static fn ($item): bool => is_string($item) && in_array($item, $allowed, true))));
}

function token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($header, 'Bearer ')) {
        return trim(substr($header, 7));
    }
    return '';
}

function adminSession(PDO $pdo): ?array
{
    $raw = token();
    if ($raw === '') {
        return null;
    }
    $hash = hash('sha256', $raw);
    $stmt = $pdo->prepare('SELECT token_hash, username, expires_at FROM admin_sessions WHERE token_hash = :token AND expires_at > UTC_TIMESTAMP() LIMIT 1');
    $stmt->execute(['token' => $hash]);
    $session = $stmt->fetch();
    return $session ?: null;
}

function requireAdmin(PDO $pdo): array
{
    $session = adminSession($pdo);
    if ($session === null) {
        fail('unauthorized', 401);
    }
    return $session;
}

function linkRecord(array $row): array
{
    $decoded = json_decode((string) $row['placements'], true);
    return [
        'linkKey' => (string) $row['link_key'],
        'label' => (string) $row['label'],
        'url' => (string) $row['url'],
        'isActive' => (bool) $row['is_active'],
        'sortOrder' => (int) $row['sort_order'],
        'placements' => is_array($decoded) ? $decoded : [],
    ];
}

function linkInput(array $input, ?array $fallback = null): array
{
    $record = [
        'linkKey' => $input['linkKey'] ?? $input['link_key'] ?? ($fallback['linkKey'] ?? ''),
        'label' => $input['label'] ?? $input['display_label'] ?? ($fallback['label'] ?? ''),
        'url' => $input['url'] ?? $input['link_url'] ?? ($fallback['url'] ?? ''),
        'isActive' => $input['isActive'] ?? $input['is_active'] ?? ($fallback['isActive'] ?? true),
        'sortOrder' => $input['sortOrder'] ?? $input['sort_order'] ?? ($fallback['sortOrder'] ?? 999),
        'placements' => placements($input['placements'] ?? ($fallback['placements'] ?? [])),
    ];
    $record['linkKey'] = is_string($record['linkKey']) ? trim($record['linkKey']) : '';
    $record['label'] = is_string($record['label']) ? trim($record['label']) : '';
    $record['url'] = is_string($record['url']) ? trim($record['url']) : '';
    $record['isActive'] = filter_var($record['isActive'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    $record['sortOrder'] = filter_var($record['sortOrder'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
    return $record;
}

function validateLink(array $record, bool $requireKey = true): bool
{
    return (!$requireKey || preg_match('/^[a-z0-9_-]{2,50}$/', $record['linkKey']) === 1)
        && validText($record['label'], 100)
        && validHttps($record['url'])
        && is_bool($record['isActive'])
        && is_int($record['sortOrder'])
        && count($record['placements']) > 0;
}

function uuid(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);
    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4) . '-' . substr($hex, 16, 4) . '-' . substr($hex, 20, 12);
}

$config = loadConfig();
$pdo = db($config);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = preg_replace('#/+#', '/', $path);

try {
    if ($path === '/api/health' && $method === 'GET') {
        respond(['ok' => true, 'service' => 'bdoffer-php-mysql']);
    }

    if ($path === '/api/admin/login' && $method === 'POST') {
        $input = body();
        $admin = $config['admin'];
        if (!isset($admin['username'], $admin['password_hash']) || !password_verify((string) ($input['password'] ?? ''), (string) $admin['password_hash']) || !hash_equals((string) $admin['username'], (string) ($input['username'] ?? ''))) {
            fail('invalid_credentials', 401);
        }
        $raw = bin2hex(random_bytes(32));
        $stmt = $pdo->prepare('INSERT INTO admin_sessions (token_hash, username, expires_at) VALUES (:token, :username, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 8 HOUR))');
        $stmt->execute(['token' => hash('sha256', $raw), 'username' => $admin['username']]);
        respond(['ok' => true, 'token' => $raw]);
    }

    if ($path === '/api/admin/session' && $method === 'GET') {
        respond(['authenticated' => adminSession($pdo) !== null]);
    }

    if ($path === '/api/admin/logout' && $method === 'POST') {
        $stmt = $pdo->prepare('DELETE FROM admin_sessions WHERE token_hash = :token');
        $stmt->execute(['token' => hash('sha256', token())]);
        respond(['ok' => true]);
    }

    if ($path === '/api/public-links' && $method === 'GET') {
        $stmt = $pdo->query('SELECT link_key, label, url, is_active, sort_order, placements FROM affiliate_links WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
        $links = [];
        foreach ($stmt as $row) {
            $record = linkRecord($row);
            $links[$record['linkKey']] = ['url' => $record['url'], 'label' => $record['label'], 'placements' => $record['placements']];
        }
        respond(['links' => $links]);
    }

    if ($path === '/api/admin/links' && $method === 'GET') {
        requireAdmin($pdo);
        $rows = $pdo->query('SELECT link_key, label, url, is_active, sort_order, placements FROM affiliate_links ORDER BY sort_order ASC, id ASC')->fetchAll();
        respond(['links' => array_map('linkRecord', $rows)]);
    }

    if ($path === '/api/admin/links' && $method === 'POST') {
        requireAdmin($pdo);
        $record = linkInput(body());
        if (!validateLink($record)) {
            fail('invalid_or_duplicate_link', 400);
        }
        $stmt = $pdo->prepare('INSERT INTO affiliate_links (link_key, label, url, is_active, sort_order, placements) VALUES (:link_key, :label, :url, :is_active, :sort_order, :placements)');
        try {
            $stmt->execute([
                'link_key' => $record['linkKey'], 'label' => $record['label'], 'url' => $record['url'],
                'is_active' => $record['isActive'] ? 1 : 0, 'sort_order' => $record['sortOrder'],
                'placements' => json_encode($record['placements'], JSON_UNESCAPED_UNICODE),
            ]);
        } catch (PDOException $exception) {
            if ((string) $exception->errorInfo[1] === '1062') {
                fail('invalid_or_duplicate_link', 400);
            }
            throw $exception;
        }
        respond($record, 201);
    }

    if (preg_match('#^/api/admin/links/([^/]+)$#', $path, $match) === 1) {
        requireAdmin($pdo);
        $key = urldecode($match[1]);
        $find = $pdo->prepare('SELECT link_key, label, url, is_active, sort_order, placements FROM affiliate_links WHERE link_key = :link_key LIMIT 1');
        $find->execute(['link_key' => $key]);
        $existing = $find->fetch();
        if (!$existing) {
            fail('link_not_found', 404);
        }
        if ($method === 'DELETE') {
            $delete = $pdo->prepare('DELETE FROM affiliate_links WHERE link_key = :link_key');
            $delete->execute(['link_key' => $key]);
            respond(['ok' => true, 'deleted' => $key]);
        }
        if ($method === 'PUT') {
            $record = linkInput(body(), linkRecord($existing));
            if ($record['linkKey'] !== $key || !validateLink($record)) {
                fail('invalid_link', 400);
            }
            $update = $pdo->prepare('UPDATE affiliate_links SET label = :label, url = :url, is_active = :is_active, sort_order = :sort_order, placements = :placements WHERE link_key = :link_key');
            $update->execute([
                'label' => $record['label'], 'url' => $record['url'], 'is_active' => $record['isActive'] ? 1 : 0,
                'sort_order' => $record['sortOrder'], 'placements' => json_encode($record['placements'], JSON_UNESCAPED_UNICODE), 'link_key' => $key,
            ]);
            respond($record);
        }
    }

    if ($path === '/api/admin/inquiries' && $method === 'GET') {
        requireAdmin($pdo);
        $rows = $pdo->query('SELECT id, name, contact, topic, message, created_at AS createdAt FROM inquiries ORDER BY created_at DESC')->fetchAll();
        respond(['inquiries' => $rows]);
    }

    if ($path === '/api/inquiries' && $method === 'POST') {
        $input = body();
        $record = [
            'id' => uuid(), 'name' => trim((string) ($input['name'] ?? '')), 'contact' => trim((string) ($input['contact'] ?? '')),
            'topic' => trim((string) ($input['topic'] ?? '')), 'message' => trim((string) ($input['message'] ?? '')),
        ];
        if (!validText($record['name'], 80) || !validText($record['contact'], 120) || !validText($record['topic'], 80) || !validText($record['message'], 500)) {
            fail('invalid_input', 400, 'Please provide valid inquiry details.');
        }
        $stmt = $pdo->prepare('INSERT INTO inquiries (id, name, contact, topic, message) VALUES (:id, :name, :contact, :topic, :message)');
        $stmt->execute($record);
        respond(['ok' => true, 'inquiryId' => $record['id'], 'message' => 'Inquiry received.'], 201);
    }

    fail('not_found', 404);
} catch (Throwable $exception) {
    error_log('[bdoffer api] ' . $exception->getMessage());
    fail('server_error', 500);
}
