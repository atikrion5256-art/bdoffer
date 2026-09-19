<?php
// Copy this file to config.php and replace every placeholder before deployment.
// Keep config.php outside public_html when possible. If it must be inside the
// document root, the repository .htaccess blocks direct browser access.
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'cpaneluser_bdoffer',
        'user' => 'cpaneluser_bdoffer',
        'pass' => 'CHANGE_THIS_DATABASE_PASSWORD',
        'charset' => 'utf8mb4',
    ],
    'admin' => [
        'username' => 'CHANGE_THIS_ADMIN_USERNAME',
        // Generate with: php -r "echo password_hash('YOUR_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
        'password_hash' => 'PASTE_BCRYPT_OR_ARGON_HASH_HERE',
    ],
];
