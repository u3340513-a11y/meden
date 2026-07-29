<?php
define('LARAVEL_START', microtime(true));

$apiBackendPath = dirname(__DIR__) . '/api_backend';

require $apiBackendPath . '/vendor/autoload.php';

$app = require_once $apiBackendPath . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

echo '<pre>';
echo 'REQUEST_URI: ' . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "\n";
echo 'SCRIPT_NAME: ' . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "\n";
echo 'basePath: ' . $app->basePath() . "\n";
echo 'publicPath: ' . $app->publicPath() . "\n\n";

$router = $app->make('router');
$routes = $router->getRoutes();
echo "Registered Routes:\n";
foreach ($routes as $route) {
    echo $route->methods()[0] . ' ' . $route->uri() . "\n";
}
echo '</pre>';
