<?php
$root = $_SERVER['DOCUMENT_ROOT'];
$storagePath = $root . '/api_backend/storage/app/public';

echo '<pre>';
echo "DOCUMENT_ROOT: $root\n";
echo "Storage path: $storagePath\n";
echo "Storage exists: " . (is_dir($storagePath) ? 'YES' : 'NO') . "\n\n";

if (is_dir($storagePath)) {
    echo "Storage contents:\n";
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($storagePath, RecursiveDirectoryIterator::SKIP_DOTS));
    foreach ($iterator as $file) {
        echo str_replace($storagePath, '', $file->getPathname()) . " (" . $file->getSize() . " bytes)\n";
    }
} else {
    echo "Trying alternative paths:\n";
    $alts = [
        $root . '/api_backend/storage',
        $root . '/api_backend/storage/app',
        dirname($root) . '/api_backend/storage/app/public',
    ];
    foreach ($alts as $p) {
        echo "$p => " . (is_dir($p) ? 'EXISTS' : 'NOT FOUND') . "\n";
    }
}

echo "\n--- .htaccess check ---\n";
echo "Root .htaccess exists: " . (file_exists($root . '/.htaccess') ? 'YES' : 'NO') . "\n";
$htaccess = file_get_contents($root . '/.htaccess');
echo "Contains storage rule: " . (strpos($htaccess, 'storage') !== false ? 'YES' : 'NO') . "\n";
echo "\n--- Product Images DB ---\n";

define('LARAVEL_START', microtime(true));
$apiBackendPath = dirname(__DIR__) . '/api_backend';
require $apiBackendPath . '/vendor/autoload.php';
$app = require_once $apiBackendPath . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$images = \DB::table('product_images')->get();
foreach ($images as $img) {
    echo "ID:{$img->id} product:{$img->product_id} path:{$img->path}\n";
    $fullPath = $storagePath . '/' . $img->path;
    echo "  Full: $fullPath => " . (file_exists($fullPath) ? 'EXISTS (' . filesize($fullPath) . ' bytes)' : 'NOT FOUND') . "\n";
}
echo '</pre>';
