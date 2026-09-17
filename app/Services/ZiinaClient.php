<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Thin wrapper around Ziina's Payment Intent API (UAE payment gateway).
 * Docs: https://docs.ziina.com/api-reference/payment-intent
 */
class ZiinaClient
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $baseUrl,
        private readonly bool $testMode,
    ) {}

    /**
     * @param  int  $amountFils  amount in fils (1 AED = 100 fils)
     * @return array{id: string, redirect_url: string, status: string}
     */
    public function createPaymentIntent(
        int $amountFils,
        string $message,
        string $successUrl,
        string $cancelUrl,
    ): array {
        $response = $this->http()->post('/payment_intent', [
            'amount' => $amountFils,
            'currency_code' => 'AED',
            'message' => $message,
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'failure_url' => $cancelUrl,
            'test' => $this->testMode,
        ])->throw();

        return $response->json();
    }

    public function getPaymentIntent(string $id): array
    {
        return $this->http()->get("/payment_intent/{$id}")->throw()->json();
    }

    private function http()
    {
        return Http::baseUrl($this->baseUrl)
            ->withToken($this->apiKey)
            ->acceptJson();
    }
}
