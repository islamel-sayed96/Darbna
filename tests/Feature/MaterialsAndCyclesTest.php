<?php

namespace Tests\Feature;

use App\Models\ContentAccess;
use App\Models\Cycle;
use App\Models\Material;
use App\Models\Payment;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MaterialsAndCyclesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    private function makeMaterial(array $overrides = []): Material
    {
        $instructor = User::role('instructor')->first();

        $material = Material::create([
            'instructor_id' => $instructor->id,
            'title' => 'مادة تجريبية '.uniqid(),
            'slug' => 'material-'.uniqid(),
            'price' => 49,
            'is_published' => true,
            'published_at' => now(),
            ...$overrides,
        ]);

        $material->pages()->create([
            'title' => 'صفحة تجريبية',
            'content' => 'محتوى تجريبي',
            'position' => 1,
        ]);

        return $material;
    }

    private function makeCycle(array $overrides = []): Cycle
    {
        $instructor = User::role('instructor')->first();

        $cycle = Cycle::create([
            'instructor_id' => $instructor->id,
            'title' => 'سايكل تجريبي '.uniqid(),
            'slug' => 'cycle-'.uniqid(),
            'price' => 149,
            'is_published' => true,
            'published_at' => now(),
            ...$overrides,
        ]);

        $cycle->lectures()->create([
            'title' => 'محاضرة تجريبية',
            'video_provider' => 'youtube',
            'video_id' => 'aqz-KE-bpKQ',
            'video_url' => 'https://youtu.be/aqz-KE-bpKQ',
            'position' => 1,
        ]);

        return $cycle;
    }

    public function test_materials_and_cycles_index_and_show_pages_render(): void
    {
        $material = $this->makeMaterial();
        $cycle = $this->makeCycle();

        $this->get(route('materials.index'))->assertOk();
        $this->get(route('materials.show', $material))->assertOk();
        $this->get(route('cycles.index'))->assertOk();
        $this->get(route('cycles.show', $cycle))->assertOk();
    }

    public function test_free_material_is_accessible_to_anyone(): void
    {
        $student = User::role('student')->first();
        $material = $this->makeMaterial(['price' => 0]);

        $this->assertTrue($student->hasAccessToMaterial($material));

        $page = $material->pages()->first();
        $this->actingAs($student)->get(route('material-pages.show', $page))
            ->assertOk();
    }

    public function test_paid_material_page_redirects_without_access(): void
    {
        $student = User::role('student')->first();
        $material = $this->makeMaterial();
        $page = $material->pages()->first();

        $this->actingAs($student)->get(route('material-pages.show', $page))
            ->assertRedirect(route('materials.show', $material));
    }

    public function test_purchasing_a_material_grants_access_and_unlocks_its_pages(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_material_123',
                'redirect_url' => 'https://pay.ziina.com/pi_material_123',
            ], 200),
            'api-v2.ziina.com/api/payment_intent/pi_material_123' => Http::response([
                'id' => 'pi_material_123',
                'status' => 'completed',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $material = $this->makeMaterial();

        $this->actingAs($student)->post(route('purchases.materials.store', $material))
            ->assertRedirect('https://pay.ziina.com/pi_material_123');

        $payment = Payment::where('user_id', $student->id)
            ->where('payable_type', Material::class)
            ->first();
        $this->assertNotNull($payment);

        $this->actingAs($student)->get(route('purchases.success', $payment))
            ->assertRedirect(route('materials.show', $material));

        $student->refresh();
        $this->assertTrue($student->hasAccessToMaterial($material));

        $page = $material->pages()->first();
        $this->actingAs($student)->get(route('material-pages.show', $page))
            ->assertOk();
    }

    public function test_purchasing_a_cycle_grants_access_to_its_lectures(): void
    {
        Http::fake([
            'api-v2.ziina.com/api/payment_intent' => Http::response([
                'id' => 'pi_cycle_123',
                'redirect_url' => 'https://pay.ziina.com/pi_cycle_123',
            ], 200),
            'api-v2.ziina.com/api/payment_intent/pi_cycle_123' => Http::response([
                'id' => 'pi_cycle_123',
                'status' => 'completed',
            ], 200),
        ]);

        $student = User::role('student')->first();
        $cycle = $this->makeCycle();

        $this->actingAs($student)->post(route('purchases.cycles.store', $cycle));
        $payment = Payment::where('user_id', $student->id)
            ->where('payable_type', Cycle::class)
            ->first();

        $this->actingAs($student)->get(route('purchases.success', $payment))
            ->assertRedirect(route('cycles.show', $cycle));

        $student->refresh();
        $this->assertTrue($student->hasAccessToCycle($cycle));

        $lecture = $cycle->lectures()->first();
        $this->actingAs($student)->get(route('cycle-lectures.show', $lecture))
            ->assertOk();
    }

    public function test_admin_can_create_a_material_with_pages(): void
    {
        $admin = User::role('admin')->first();

        $response = $this->actingAs($admin)->post(route('admin.materials.store'), [
            'title' => 'مادة إدارية',
            'price' => 29,
            'is_published' => true,
        ]);

        $response->assertRedirect();
        $material = Material::where('title', 'مادة إدارية')->firstOrFail();

        $this->actingAs($admin)->post(route('admin.material-pages.store', $material), [
            'title' => 'صفحة أولى',
            'content' => 'نص الصفحة',
        ])->assertRedirect();

        $this->assertSame(1, $material->pages()->count());
    }

    public function test_admin_can_create_a_cycle_with_lectures(): void
    {
        $admin = User::role('admin')->first();

        $response = $this->actingAs($admin)->post(route('admin.cycles.store'), [
            'title' => 'سايكل إدارية',
            'price' => 99,
            'is_published' => true,
        ]);

        $response->assertRedirect();
        $cycle = Cycle::where('title', 'سايكل إدارية')->firstOrFail();

        $this->actingAs($admin)->post(route('admin.cycle-lectures.store', $cycle), [
            'title' => 'محاضرة أولى',
            'video_url' => 'https://youtu.be/aqz-KE-bpKQ',
        ])->assertRedirect();

        $this->assertSame(1, $cycle->lectures()->count());
        $this->assertSame('aqz-KE-bpKQ', $cycle->lectures()->first()->video_id);
    }

    public function test_admin_can_manually_grant_access_to_a_material(): void
    {
        $admin = User::role('admin')->first();
        $student = User::role('student')->first();
        $material = $this->makeMaterial();

        $response = $this->actingAs($admin)->post(route('admin.enrollments.store'), [
            'type' => 'material',
            'email' => $student->email,
            'content_id' => $material->id,
        ]);

        $response->assertRedirect();
        $student->refresh();
        $this->assertTrue($student->hasAccessToMaterial($material));
        $this->assertDatabaseHas('content_accesses', [
            'user_id' => $student->id,
            'accessible_type' => Material::class,
            'accessible_id' => $material->id,
            'source' => ContentAccess::SOURCE_MANUAL,
        ]);
    }

    public function test_admin_can_manually_grant_access_to_a_cycle(): void
    {
        $admin = User::role('admin')->first();
        $student = User::role('student')->first();
        $cycle = $this->makeCycle();

        $this->actingAs($admin)->post(route('admin.enrollments.store'), [
            'type' => 'cycle',
            'email' => $student->email,
            'content_id' => $cycle->id,
        ])->assertRedirect();

        $student->refresh();
        $this->assertTrue($student->hasAccessToCycle($cycle));
    }

    public function test_admin_pages_for_materials_cycles_and_manual_access_render(): void
    {
        $admin = User::role('admin')->first();
        $material = $this->makeMaterial();
        $cycle = $this->makeCycle();

        $this->actingAs($admin)->get(route('admin.materials.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.materials.create'))->assertOk();
        $this->actingAs($admin)->get(route('admin.materials.edit', $material))->assertOk();
        $this->actingAs($admin)->get(route('admin.cycles.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.cycles.create'))->assertOk();
        $this->actingAs($admin)->get(route('admin.cycles.edit', $cycle))->assertOk();
        $this->actingAs($admin)->get(route('admin.enrollments.index'))->assertOk();
    }

    public function test_admin_can_revoke_manual_content_access(): void
    {
        $admin = User::role('admin')->first();
        $student = User::role('student')->first();
        $material = $this->makeMaterial();

        $access = ContentAccess::create([
            'user_id' => $student->id,
            'accessible_type' => Material::class,
            'accessible_id' => $material->id,
            'source' => ContentAccess::SOURCE_MANUAL,
            'granted_at' => now(),
        ]);

        $this->actingAs($admin)->delete(route('admin.content-accesses.destroy', $access))
            ->assertRedirect();

        $student->refresh();
        $this->assertFalse($student->hasAccessToMaterial($material));
    }
}
