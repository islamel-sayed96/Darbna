<?php

namespace App\Http\Controllers;

use App\Models\ContentAccess;
use App\Models\Cycle;
use App\Models\Material;
use App\Models\Payment;
use App\Services\ZiinaClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Throwable;

/**
 * One-time (non-subscription) purchases of a single Material or Cycle —
 * parallel to CheckoutController, which handles recurring subscription
 * plans. Both share the same Ziina payment-intent flow.
 */
class PurchaseController extends Controller
{
    public function storeMaterial(Material $material, ZiinaClient $ziina): RedirectResponse|SymfonyResponse
    {
        abort_unless($material->is_published, 404);

        return $this->startPayment($material, "مادة علمية - {$material->title}", $ziina);
    }

    public function storeCycle(Cycle $cycle, ZiinaClient $ziina): RedirectResponse|SymfonyResponse
    {
        abort_unless($cycle->is_published, 404);

        return $this->startPayment($cycle, "سايكل - {$cycle->title}", $ziina);
    }

    public function success(Payment $payment, ZiinaClient $ziina): RedirectResponse
    {
        abort_unless($payment->user_id === auth()->id(), 403);
        abort_unless($payment->gateway_reference, 404);

        $intent = $ziina->getPaymentIntent($payment->gateway_reference);

        if (($intent['status'] ?? null) !== 'completed') {
            return redirect()->route('home')->with('success', 'لم يتم تأكيد الدفع، حاول مرة أخرى.');
        }

        if ($payment->status !== 'paid') {
            $payment->update(['status' => 'paid', 'paid_at' => now()]);

            ContentAccess::firstOrCreate([
                'user_id' => $payment->user_id,
                'accessible_type' => $payment->payable_type,
                'accessible_id' => $payment->payable_id,
            ], [
                'source' => ContentAccess::SOURCE_PURCHASE,
                'granted_at' => now(),
            ]);
        }

        $payable = $payment->payable;
        $routeName = $payable instanceof Material ? 'materials.show' : 'cycles.show';

        return redirect()->route($routeName, $payable)->with('success', 'تم الشراء بنجاح! المحتوى مفتوح دلوقتي.');
    }

    public function cancel(Payment $payment): RedirectResponse
    {
        abort_unless($payment->user_id === auth()->id(), 403);

        if ($payment->status === 'pending') {
            $payment->update(['status' => 'failed']);
        }

        $payable = $payment->payable;
        $routeName = $payable instanceof Material ? 'materials.show' : 'cycles.show';

        return redirect()->route($routeName, $payable)->with('success', 'تم إلغاء عملية الدفع.');
    }

    private function startPayment(Material|Cycle $payable, string $message, ZiinaClient $ziina): RedirectResponse|SymfonyResponse
    {
        $payment = Payment::create([
            'user_id' => auth()->id(),
            'payable_type' => $payable::class,
            'payable_id' => $payable->id,
            'amount' => $payable->price,
            'currency' => $payable->currency,
            'gateway' => 'ziina',
            'status' => 'pending',
        ]);

        try {
            $intent = $ziina->createPaymentIntent(
                amountFils: (int) round($payable->price * 100),
                message: "دربنا - {$message}",
                successUrl: route('purchases.success', $payment),
                cancelUrl: route('purchases.cancel', $payment),
            );
        } catch (Throwable $e) {
            Log::error('Ziina payment intent creation failed.', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'payment_id' => $payment->id,
            ]);
            $payment->update(['status' => 'failed']);

            $routeName = $payable instanceof Material ? 'materials.show' : 'cycles.show';

            return redirect()->route($routeName, $payable)
                ->with('success', 'حصل خطأ أثناء بدء عملية الدفع، حاول تاني أو تواصل معانا لو استمرت المشكلة.');
        }

        $payment->update(['gateway_reference' => $intent['id'] ?? null]);

        return Inertia::location($intent['redirect_url']);
    }
}
