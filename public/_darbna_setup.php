<?php

/**
 * One-time deployment helper.
 *
 * Hostinger's SSH/CLI environment on this account is locked to PHP 8.2,
 * while the website itself runs on the PHP version configured in hPanel
 * (8.4) — too old to run `php artisan` over SSH, but this script runs
 * through the web server's PHP, so it can. Visit it once with the correct
 * token to run first-deploy setup, then DELETE THIS FILE — it is a
 * standing risk to leave on a live site since it can rerun migrations.
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

$commands = [
    ['migrate', ['--seed' => true, '--force' => true]],
    ['storage:link', []],
    ['config:cache', []],
    ['route:cache', []],
    ['view:cache', []],
];

foreach ($commands as [$command, $arguments]) {
    echo "\$ php artisan {$command}\n";

    try {
        $kernel->call($command, $arguments);
        echo $kernel->output();
    } catch (\Throwable $e) {
        echo 'ERROR: '.get_class($e).': '.$e->getMessage()."\n";
        echo $e->getFile().':'.$e->getLine()."\n\n";
        echo $e->getTraceAsString()."\n";
        echo str_repeat('-', 60)."\n";
        echo "Stopped — fix the error above before rerunning.\n";
        exit;
    }

    echo str_repeat('-', 60)."\n";
}

echo "Done. Delete this file now (public/_darbna_setup.php).\n";
