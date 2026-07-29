<?php
echo json_encode([
    'htaccess_exists' => file_exists(__DIR__ . '/.htaccess'),
    'htaccess_content' => file_exists(__DIR__ . '/.htaccess') ? file_get_contents(__DIR__ . '/.htaccess') : 'NOT FOUND',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
    'php_self' => $_SERVER['PHP_SELF'] ?? 'N/A',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'dir_listing' => scandir(__DIR__),
]);
