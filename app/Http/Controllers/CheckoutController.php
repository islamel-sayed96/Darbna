<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\ZiinaClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Throwable;

class CheckoutController extends Controller
{
    public function store(SubscriptionPlan $plan, ZiinaClient $ziina): RedirectResponse|SymfonyResponse
    {
        abort_unless($plan->is_active, 404);

        $payment = Payment::create([
            'user_id' => auth()->id(),
            'payable_type' => SubscriptionPlan::class,
            'payable_id' => $plan->id,
            'amount' => $plan->price,
            'currency' => $plan->currency,
            'gateway' => 'ziina',
            'status' => 'pending',
        ]);

        try {
            $intent = $ziina->createPaymentIntent(
                amountFils: (int) round($plan->price * 100),
                message: "اشتراك دربنا - {$plan->name}",
                successUrl: route('checkout.success', $payment),
                cancelUrl: route('checkout.cancel', $payment),
            );
        } catch (Throwable $e) {
            Log::error('Ziina payment intent creation failed.', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'payment_id' => $payment->id,
            ]);
            $payment->update(['status' => 'failed']);

            return redirect()->route('pricing')->with('success', 'حصل خطأ أثناء بدء عملية الدفع، حاول تاني أو تواصل معانا لو استمرت المشكلة.');
        }

        $payment->update(['gateway_reference' => $intent['id'] ?? null]);

        // Ziina's checkout page lives outside the Inertia app, so a plain
        // redirect()->away() would make the Inertia client try to load it
        // as an XHR response and fail. Inertia::location() instead returns
        // a 409 with X-Inertia-Location, telling the client to do a real
        // full-page browser navigation.
        return Inertia::location($intent['redirect_url']);
    }

    public function success(Payment $payment, ZiinaClient $ziina): RedirectResponse
    {
        abort_unless($payment->user_id === auth()->id(), 403);
        abort_unless($payment->gateway_reference, 404);

        $intent = $ziina->getPaymentIntent($payment->gateway_reference);

        // TODO: drop this once Ziina's exact "paid" status string is
        // confirmed against a real test checkout (network access to their
        // docs was blocked while building this integration).
        Log::info('Ziina payment intent on success callback.', $intent);

        if (($intent['status'] ?? null) !== 'completed') {
            return redirect()->route('pricing')->with('success', 'لم يتم تأكيد الدفع، حاول مرة أخرى.');
        }

        if ($payment->status !== 'paid') {
            $payment->update(['status' => 'paid', 'paid_at' => now()]);
            $subscription = $this->activateSubscription($payment);
        } else {
            $subscription = Subscription::where('payment_reference', $payment->gateway_reference)->first();
        }

        if ($subscription && $subscription->needsSelection()) {
            return redirect()->route('subscriptions.select.edit', $subscription)
                ->with('success', 'تم تفعيل اشتراكك! اختار الكورسات أو المسارات اللي عايز توصل لها.');
        }

        return redirect()->route('student.dashboard')->with('success', 'تم تفعيل اشتراكك بنجاح!');
    }

    public function cancel(Payment $payment): RedirectResponse
    {
        abort_unless($payment->user_id === auth()->id(), 403);

        if ($payment->status === 'pending') {
            $payment->update(['status' => 'failed']);
        }

        return redirect()->route('pricing')->with('success', 'تم إلغاء عملية الدفع.');
    }

    private function activateSubscription(Payment $payment): Subscription
    {
        /** @var SubscriptionPlan $plan */
        $plan = $payment->payable;
        $startsAt = now();

        return Subscription::create([
            'user_id' => $payment->user_id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addMonths($plan->duration_months),
            'payment_reference' => $payment->gateway_reference,
        ]);
    }
}
