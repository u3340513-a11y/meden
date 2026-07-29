<?php
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$pathInfo = $_SERVER['PATH_INFO'] ?? null;

if ($pathInfo) {
    $path = ltrim($pathInfo, '/');
} else {
    $parsed = parse_url($requestUri, PHP_URL_PATH);
    $path = preg_replace('#^/storage/?#', '', $parsed);
}

$basePath = __DIR__ . '/api_backend/storage/app/public';
$realBase = realpath($basePath);

if (isset($_GET['debug'])) {
    echo "REQUEST_URI: $requestUri\n";
    echo "PATH_INFO: " . ($pathInfo ?? 'NULL') . "\n";
    echo "Parsed path: $path\n";
    echo "Base: $basePath\n";
    echo "RealBase: " . ($realBase ?: 'FALSE') . "\n";
    echo "Full: $basePath/$path\n";
    echo "Exists: " . (file_exists("$basePath/$path") ? 'YES' : 'NO') . "\n";
    echo "RealFile: " . (realpath("$basePath/$path") ?: 'FALSE') . "\n";
    exit;
}

if (empty($path) || strpos($path, '..') !== false || !$realBase) {
    http_response_code(404);
    exit('Not Found');
}

$file = realpath($basePath . '/' . $path);

if (!$file || strpos($file, $realBase) !== 0 || !is_file($file)) {
    http_response_code(404);
    exit('Not Found');
}

$mimes = [
    'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
    'gif' => 'image/gif', 'webp' => 'image/webp', 'svg' => 'image/svg+xml',
    'pdf' => 'application/pdf', 'mp4' => 'video/mp4',
];
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$mime = $mimes[$ext] ?? (function_exists('mime_content_type') ? mime_content_type($file) : 'application/octet-stream');

header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($file));
header('Cache-Control: public, max-age=31536000, immutable');
readfile($file);
exit;
