<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ZiinaCheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_subscribing_creates_a_payment_and_redirects_to_ziinas_hosted_page(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_test_123',
                'redirect_url' => 'https://pay.ziina.com/pi_test_123',
                'status' => 'requires_payment_instrument',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();

        $response = $this->actingAs($student)->post(route('checkout.store', $plan));

        $response->assertRedirect('https://pay.ziina.com/pi_test_123');

        $payment = Payment::where('user_id', $student->id)->first();
        $this->assertNotNull($payment);
        $this->assertSame('pending', $payment->status);
        $this->assertSame('pi_test_123', $payment->gateway_reference);
        $this->assertSame((float) $plan->price, (float) $payment->amount);

        Http::assertSent(function ($request) use ($plan) {
            return $request->url() === 'https://api-v2.ziina.com/api/payment_intent'
                && $request['amount'] === (int) round($plan->price * 100)
                && $request['currency_code'] === 'AED'
                && $request->hasHeader('Authorization');
        });
    }

    public function test_a_ziina_response_missing_redirect_url_does_not_crash_and_redirects_back_with_a_message(): void
    {
        // Reproduces the real bug: e.g. a bad/missing API key or an
        // unexpected response shape used to cause an uncaught 500 instead
        // of a friendly redirect back to pricing.
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_broken',
                'status' => 'requires_payment_instrument',
                // no redirect_url
            ], 200),
        ]);

        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();

        $response = $this->actingAs($student)->post(route('checkout.store', $plan));

        $response->assertRedirect(route('pricing'));
        $response->assertSessionHas('success');

        $payment = Payment::where('user_id', $student->id)->first();
        $this->assertSame('failed', $payment->status);
    }

    public function test_an_unauthorized_ziina_response_does_not_crash_and_redirects_back_with_a_message(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response(['message' => 'Unauthorized'], 401),
        ]);

        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();

        $response = $this->actingAs($student)->post(route('checkout.store', $plan));

        $response->assertRedirect(route('pricing'));

        $payment = Payment::where('user_id', $student->id)->first();
        $this->assertSame('failed', $payment->status);
    }

    public function test_successful_payment_activates_a_subscription(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_test_456',
                'redirect_url' => 'https://pay.ziina.com/pi_test_456',
                'status' => 'requires_payment_instrument',
            ], 200),
            'api-v2.ziina.com/api/payment_intent/pi_test_456' => Http::response([
                'id' => 'pi_test_456',
                'status' => 'completed',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-12m')->first();

        $this->actingAs($student)->post(route('checkout.store', $plan));
        $payment = Payment::where('user_id', $student->id)->first();

        $response = $this->actingAs($student)->get(route('checkout.success', $payment));
        $response->assertRedirect(route('student.dashboard'));

        $payment->refresh();
        $this->assertSame('paid', $payment->status);
        $this->assertNotNull($payment->paid_at);

        $subscription = $student->activeSubscription();
        $this->assertNotNull($subscription);
        $this->assertSame($plan->id, $subscription->plan_id);
        $this->assertTrue($subscription->ends_at->greaterThan(now()->addMonths(11)));
    }

    public function test_incomplete_payment_does_not_activate_a_subscription(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_test_789',
                'redirect_url' => 'https://pay.ziina.com/pi_test_789',
            ], 200),
            'api-v2.ziina.com/api/payment_intent/pi_test_789' => Http::response([
                'id' => 'pi_test_789',
                'status' => 'requires_payment_instrument',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();

        $this->actingAs($student)->post(route('checkout.store', $plan));
        $payment = Payment::where('user_id', $student->id)->first();

        $this->actingAs($student)->get(route('checkout.success', $payment));

        $payment->refresh();
        $this->assertSame('pending', $payment->status);
        $this->assertNull($student->activeSubscription());
    }

    public function test_a_user_cannot_view_another_users_payment_callback(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_test_other',
                'redirect_url' => 'https://pay.ziina.com/pi_test_other',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $otherStudent = User::factory()->create();
        $otherStudent->assignRole('student');

        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();
        $this->actingAs($student)->post(route('checkout.store', $plan));
        $payment = Payment::where('user_id', $student->id)->first();

        $this->actingAs($otherStudent)->get(route('checkout.success', $payment))
            ->assertForbidden();
    }

    public function test_cancelling_marks_the_pending_payment_as_failed(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_test_cancel',
                'redirect_url' => 'https://pay.ziina.com/pi_test_cancel',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();
        $this->actingAs($student)->post(route('checkout.store', $plan));
        $payment = Payment::where('user_id', $student->id)->first();

        $this->actingAs($student)->get(route('checkout.cancel', $payment))
            ->assertRedirect(route('pricing'));

        $this->assertSame('failed', $payment->fresh()->status);
    }
}
