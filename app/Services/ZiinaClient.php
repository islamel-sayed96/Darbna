<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
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
        ]);

        $this->assertUsable($response, 'create payment intent');

        $data = $response->json();

        if (empty($data['redirect_url'])) {
            throw new ZiinaApiException(
                "Ziina create-payment-intent response missing redirect_url. Body: {$response->body()}"
            );
        }

        return $data;
    }

    public function getPaymentIntent(string $id): array
    {
        $response = $this->http()->get("/payment_intent/{$id}");

        $this->assertUsable($response, 'get payment intent');

        return $response->json();
    }

    private function assertUsable(Response $response, string $action): void
    {
        if ($response->failed()) {
            throw new ZiinaApiException(
                "Ziina {$action} failed with status {$response->status()}. Body: {$response->body()}"
            );
        }

        if ($response->json() === null) {
            throw new ZiinaApiException(
                "Ziina {$action} returned a non-JSON response. Body: {$response->body()}"
            );
        }
    }

    private function http()
    {
        return Http::baseUrl($this->baseUrl)
            ->withToken($this->apiKey)
            ->acceptJson();
    }
}
