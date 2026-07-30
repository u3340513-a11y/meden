<?php
header('Content-Type: text/plain; charset=utf-8');

$root = $_SERVER['DOCUMENT_ROOT'];
$base = $root . '/api_backend/storage/app/public';

echo "=== STORAGE KONTROL ===\n";
echo "DOCUMENT_ROOT: $root\n";
echo "Storage base: $base\n";
echo "Exists: " . (is_dir($base) ? 'EVET' : 'HAYIR') . "\n\n";

echo "=== STORAGE İÇERİK ===\n";
if (is_dir($base)) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, RecursiveDirectoryIterator::SKIP_DOTS));
    $count = 0;
    foreach ($it as $f) {
        echo str_replace($base, '', $f->getPathname()) . " (" . $f->getSize() . " b)\n";
        $count++;
    }
    if ($count === 0) echo "(BOŞ — hiç dosya yok)\n";
} else {
    echo "Dizin mevcut değil!\n";
}

echo "\n=== .ENV KONTROL ===\n";
$envFile = $root . '/api_backend/.env';
if (file_exists($envFile)) {
    $env = file_get_contents($envFile);
    preg_match('/APP_URL=(.*)/', $env, $m1);
    preg_match('/DB_CONNECTION=(.*)/', $env, $m2);
    preg_match('/DB_DATABASE=(.*)/', $env, $m3);
    echo "APP_URL: " . trim($m1[1] ?? '?') . "\n";
    echo "DB_CONNECTION: " . trim($m2[1] ?? '?') . "\n";
    echo "DB_DATABASE: " . trim($m3[1] ?? '?') . "\n";
} else {
    echo ".env BULUNAMADI!\n";
}

echo "\n=== DB İÇERİK (product_images) ===\n";
define('LARAVEL_START', microtime(true));
$appPath = $root . '/api_backend';
require $appPath . '/vendor/autoload.php';
$app = require_once $appPath . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$images = \DB::table('product_images')->limit(10)->get();
echo "Toplam kayıt: " . \DB::table('product_images')->count() . "\n";
foreach ($images as $img) {
    echo "ID:{$img->id} product:{$img->product_id} path:{$img->path}\n";
    $full = $base . '/' . $img->path;
    echo "  -> " . (file_exists($full) ? "MEVCUT (" . filesize($full) . " b)" : "YOK!") . "\n";
}

echo "\n=== url() ÇIKTISI ===\n";
if (count($images) > 0) {
    $first = $images[0];
    echo "url('/storage/{$first->path}'): " . url("/storage/{$first->path}") . "\n";
}

echo "\n=== PRODUCT API TEST ===\n";
$lastProduct = \DB::table('products')->orderByDesc('id')->first();
if ($lastProduct) {
    echo "Son ürün: id={$lastProduct->id} name={$lastProduct->name}\n";
    $product = \App\Models\Product::with(['images', 'coverImage', 'category'])->find($lastProduct->id);
    $resource = new \App\Http\Resources\ProductResource($product);
    $data = $resource->toArray(request());
    echo "cover_image: " . ($data['cover_image'] ?? 'NULL') . "\n";
    echo "description: " . (isset($data['description']) ? substr($data['description'], 0, 50) : 'MISSING!') . "\n";
    echo "category: " . json_encode($data['category'] ?? 'NULL') . "\n";
    echo "images count: " . (is_countable($data['images'] ?? null) ? count($data['images']) : 'MISSING') . "\n";
    if (!empty($data['images'])) {
        echo "first image url: " . $data['images'][0]['url'] . "\n";
    }
}
