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
        // Cast to string: if ZIINA_API_KEY isn't set, config() returns null,
        // and ZiinaClient's constructor takes a non-nullable string — that
        // TypeError would happen during dependency injection, before the
        // controller's try/catch can ever run it down to a friendly error.
        // An empty key instead fails as a normal 401 from Ziina, which is
        // already handled gracefully.
        $this->app->singleton(ZiinaClient::class, fn () => new ZiinaClient(
            apiKey: (string) config('services.ziina.key'),
            baseUrl: (string) config('services.ziina.base_url'),
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
