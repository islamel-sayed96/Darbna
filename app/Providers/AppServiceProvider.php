<?php

namespace App\Providers;

use App\Services\ZiinaClient;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ZiinaClient::class, fn () => new ZiinaClient(
            apiKey: config('services.ziina.key'),
            baseUrl: config('services.ziina.base_url'),
            testMode: (bool) config('services.ziina.test_mode'),
        ));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
