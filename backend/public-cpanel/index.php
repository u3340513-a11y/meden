<?php

define('LARAVEL_START', microtime(true));

$apiBackendPath = dirname(__DIR__) . '/api_backend';

if (file_exists($maintenance = $apiBackendPath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $apiBackendPath . '/vendor/autoload.php';

$app = require_once $apiBackendPath . '/bootstrap/app.php';

use Illuminate\Http\Request;

$app->handleRequest(Request::capture());
