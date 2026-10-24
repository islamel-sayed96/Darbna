<?php

/**
 * One-time deploy helper — diagnose then fix.
 *
 * Hostinger's SSH/CLI environment on this account is locked to an older
 * PHP than the website itself runs (configured in hPanel), so `php
 * artisan` over SSH can fail the framework's platform check. This script
 * runs through the web server's PHP instead, so it can. Visit it once
 * with the correct token, read the output, then DELETE THIS FILE — it is
 * a standing risk to leave on a live site since it can rerun migrations.
 */

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

/** @var \Illuminate\Foundation\Console\Kernel $kernel */
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Gated by a token read from .env (SETUP_SCRIPT_TOKEN) — never committed to
// git — rather than a hardcoded secret, so nothing sensitive ships in the
// repo even temporarily. Add any random value for SETUP_SCRIPT_TOKEN to
// .env on the server before visiting this script. Checked only after
// bootstrap() so .env has actually been loaded by then.
$expected = env('SETUP_SCRIPT_TOKEN');
$given = $_GET['token'] ?? '';

if (! $expected || ! hash_equals((string) $expected, (string) $given)) {
    http_response_code(404);
    exit('Not found.');
}

header('Content-Type: text/plain; charset=utf-8');

echo 'PHP version running this request: '.PHP_VERSION."\n";
echo str_repeat('=', 60)."\n\n";

echo "Migration status BEFORE:\n";
$kernel->call('migrate:status');
echo $kernel->output();
echo str_repeat('-', 60)."\n";

$logPath = __DIR__.'/../storage/logs/laravel.log';
if (is_file($logPath)) {
    echo "Last 4000 chars of storage/logs/laravel.log:\n";
    $size = filesize($logPath);
    $chunk = min($size, 4000);
    $handle = fopen($logPath, 'r');
    fseek($handle, -$chunk, SEEK_END);
    echo fread($handle, $chunk);
    fclose($handle);
    echo "\n".str_repeat('-', 60)."\n";
} else {
    echo "No storage/logs/laravel.log file found.\n";
    echo str_repeat('-', 60)."\n";
}

$commands = [
    ['config:clear', []],
    ['route:clear', []],
    ['view:clear', []],
    ['migrate', ['--force' => true]],
    ['config:cache', []],
    ['route:cache', []],
    ['view:cache', []],
];

foreach ($commands as [$command, $arguments]) {
    echo "\$ php artisan {$command}\n";
    $kernel->call($command, $arguments);
    echo $kernel->output();
    echo str_repeat('-', 60)."\n";
}

echo "Done. Delete this file now (public/darbna9f2k.php).\n";
