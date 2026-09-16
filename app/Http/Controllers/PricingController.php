<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Pricing/Index', [
            'plans' => SubscriptionPlan::where('is_active', true)
                ->orderBy('price')
                ->get(),
        ]);
    }
}
