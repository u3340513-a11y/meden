<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://medeniyetpazarı.com',
        'https://www.medeniyetpazarı.com',
        'https://xn--medeniyetpazar-jgc.com',
        'https://www.xn--medeniyetpazar-jgc.com',
        'https://medeniyetpazari.com',
        'https://www.medeniyetpazari.com',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
