<?php
header('Content-Type: text/plain; charset=utf-8');

$root = $_SERVER['DOCUMENT_ROOT'];
$base = $root . '/api_backend/storage/app/public';

echo "=== SERVER INFO ===\n";
echo "DOCUMENT_ROOT: $root\n";
echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? '?') . "\n";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? '?') . "\n";
echo "PHP_SELF: " . ($_SERVER['PHP_SELF'] ?? '?') . "\n";

echo "\n=== STORAGE KONTROL ===\n";
echo "Storage base: $base\n";
echo "Exists: " . (is_dir($base) ? 'EVET' : 'HAYIR') . "\n";

echo "\n=== STORAGE İÇERİK ===\n";
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
    preg_match('/APP_ENV=(.*)/', $env, $m4);
    echo "APP_URL: " . trim($m1[1] ?? '?') . "\n";
    echo "APP_ENV: " . trim($m4[1] ?? '?') . "\n";
} else {
    echo ".env BULUNAMADI!\n";
}

echo "\n=== LARAVEL BOOTSTRAP ===\n";
define('LARAVEL_START', microtime(true));
$appPath = $root . '/api_backend';
require $appPath . '/vendor/autoload.php';
$app = require_once $appPath . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "config('app.url'): " . config('app.url') . "\n";
echo "url('/'): " . url('/') . "\n";
echo "url('/storage/test'): " . url('/storage/test') . "\n";
echo "rtrim(config('app.url'),'/').\"/storage/test\": " . rtrim(config('app.url'), '/') . "/storage/test\n";

echo "\n=== CONFIG CACHE CHECK ===\n";
$cacheFile = $appPath . '/bootstrap/cache/config.php';
echo "Config cache exists: " . (file_exists($cacheFile) ? 'EVET (' . date('Y-m-d H:i:s', filemtime($cacheFile)) . ')' : 'HAYIR') . "\n";
if (file_exists($cacheFile)) {
    $cached = require $cacheFile;
    echo "Cached APP_URL: " . ($cached['app']['url'] ?? '?') . "\n";
}

echo "\n=== DB - product_images ===\n";
$images = \DB::table('product_images')->limit(10)->get();
echo "Toplam kayıt: " . \DB::table('product_images')->count() . "\n";
foreach ($images as $img) {
    echo "ID:{$img->id} product:{$img->product_id} path:{$img->path}\n";
    $full = $base . '/' . $img->path;
    echo "  -> " . (file_exists($full) ? "MEVCUT (" . filesize($full) . " b)" : "YOK!") . "\n";
}

echo "\n=== PRODUCT RESOURCE TEST ===\n";
$lastProduct = \DB::table('products')->orderByDesc('id')->first();
if ($lastProduct) {
    echo "Son ürün: id={$lastProduct->id} name={$lastProduct->name} seller_id={$lastProduct->seller_id}\n";
    $product = \App\Models\Product::with(['images', 'coverImage', 'category', 'seller:id,name'])->find($lastProduct->id);
    $resource = new \App\Http\Resources\ProductResource($product);
    $data = $resource->toArray(request());

    echo "name: " . ($data['name'] ?? 'NULL') . "\n";
    echo "description: " . (isset($data['description']) ? substr($data['description'], 0, 50) : 'MISSING KEY!') . "\n";
    echo "price: " . ($data['price'] ?? 'NULL') . "\n";
    echo "stock: " . ($data['stock'] ?? 'NULL') . "\n";
    echo "condition: " . ($data['condition'] ?? 'NULL') . "\n";
    echo "category: " . json_encode($data['category'] ?? 'NULL') . "\n";
    echo "cover_image: " . ($data['cover_image'] ?? 'NULL') . "\n";
    echo "images count: " . (is_countable($data['images'] ?? null) ? count($data['images']) : 'MISSING') . "\n";
    if (!empty($data['images'])) {
        echo "first image url: " . $data['images'][0]['url'] . "\n";
        echo "first image thumbnail: " . $data['images'][0]['thumbnail'] . "\n";
    }
}

echo "\n=== SELLER PRODUCT SHOW TEST ===\n";
if ($lastProduct) {
    echo "Auth user test (seller_id={$lastProduct->seller_id}):\n";
    $sellerProduct = \App\Models\Product::with(['images', 'coverImage', 'category'])
        ->where('seller_id', $lastProduct->seller_id)
        ->find($lastProduct->id);
    if ($sellerProduct) {
        echo "Product found: YES\n";
        echo "Product JSON:\n";
        $resource2 = new \App\Http\Resources\ProductResource($sellerProduct);
        echo json_encode($resource2->toArray(request()), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    } else {
        echo "Product found: NO (seller_id mismatch!)\n";
    }
}

echo "\n=== DONE ===\n";
