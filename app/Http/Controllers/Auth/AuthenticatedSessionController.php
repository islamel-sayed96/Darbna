<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        $this->rememberIntendedRedirect($request);

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'redirect' => $request->query('redirect'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * A guest bounced to login from a client-side action (e.g. the "اشترك
     * الآن" button on the pricing page) has no server-set intended URL, so
     * we accept one via ?redirect= — only when it points back at this same
     * app, to avoid becoming an open redirect.
     */
    private function rememberIntendedRedirect(Request $request): void
    {
        $redirect = $request->query('redirect');

        if ($redirect && str_starts_with($redirect, url('/'))) {
            $request->session()->put('url.intended', $redirect);
        }
    }
}
