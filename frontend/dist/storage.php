<?php
$base = '/home/isla2053/public_html/xn--medeniyetpazar-jgc.com/api_backend/storage/app/public';
$path = $_GET['path'] ?? '';
$path = ltrim(str_replace(['..', "\0"], '', $path), '/');
if (empty($path)) { http_response_code(404); exit('Not Found'); }
$file = $base . '/' . $path;
if (!file_exists($file) || !is_file($file)) { http_response_code(404); exit('Not Found'); }
$mimes = ['jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','gif'=>'image/gif','webp'=>'image/webp','svg'=>'image/svg+xml'];
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$mime = $mimes[$ext] ?? 'application/octet-stream';
header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($file));
header('Cache-Control: public, max-age=31536000');
readfile($file);
