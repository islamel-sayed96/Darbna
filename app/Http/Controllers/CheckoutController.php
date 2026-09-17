<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\ZiinaClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class CheckoutController extends Controller
{
    public function store(SubscriptionPlan $plan, ZiinaClient $ziina): RedirectResponse
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

        return redirect()->away($intent['redirect_url']);
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
            $this->activateSubscription($payment);
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

    private function activateSubscription(Payment $payment): void
    {
        /** @var SubscriptionPlan $plan */
        $plan = $payment->payable;
        $startsAt = now();

        $endsAt = match ($plan->interval) {
            'half_year' => $startsAt->copy()->addMonths(6),
            'year' => $startsAt->copy()->addYear(),
            default => $startsAt->copy()->addMonth(),
        };

        Subscription::create([
            'user_id' => $payment->user_id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'payment_reference' => $payment->gateway_reference,
        ]);
    }
}
