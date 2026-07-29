<?php
$path = ltrim($_SERVER['PATH_INFO'] ?? ($_SERVER['REQUEST_URI'] ? preg_replace('#^/storage/?#', '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)) : ''), '/');

if (empty($path) || strpos($path, '..') !== false) {
    http_response_code(404);
    exit('Not Found');
}

$basePath = realpath(__DIR__ . '/api_backend/storage/app/public');
$file = realpath($basePath . '/' . $path);

if (!$file || strpos($file, $basePath) !== 0 || !is_file($file)) {
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
header('ETag: "' . md5_file($file) . '"');
readfile($file);
exit;
