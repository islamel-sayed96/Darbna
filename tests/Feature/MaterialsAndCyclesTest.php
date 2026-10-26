<?php

namespace Tests\Feature;

use App\Models\ContentAccess;
use App\Models\Cycle;
use App\Models\CycleMaterial;
use App\Models\Material;
use App\Models\Payment;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
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

    public function test_guest_visiting_a_locked_cycle_lecture_is_sent_to_login(): void
    {
        $cycle = $this->makeCycle();
        $lecture = $cycle->lectures()->first();

        $this->get(route('cycle-lectures.show', $lecture))
            ->assertRedirect(route('login', ['redirect' => route('cycles.show', $cycle)]));
    }

    public function test_cycle_lecture_recording_can_be_a_zoom_link_instead_of_youtube(): void
    {
        $admin = User::role('admin')->first();
        $cycle = $this->makeCycle();

        $this->actingAs($admin)->post(route('admin.cycle-lectures.store', $cycle), [
            'title' => 'محاضرة بتسجيل زووم',
            'video_url' => 'https://zoom.us/rec/share/abc123',
        ])->assertRedirect();

        $lecture = $cycle->lectures()->where('title', 'محاضرة بتسجيل زووم')->first();
        $this->assertSame('external', $lecture->video_provider);
        $this->assertNull($lecture->video_id);
        $this->assertSame('https://zoom.us/rec/share/abc123', $lecture->video_url);
    }

    public function test_admin_can_attach_a_link_and_an_existing_material_to_a_cycle(): void
    {
        $admin = User::role('admin')->first();
        $cycle = $this->makeCycle();
        $material = $this->makeMaterial(['price' => 49]);

        $this->actingAs($admin)->post(route('admin.cycle-materials.store', $cycle), [
            'type' => 'link',
            'title' => 'ملخص خارجي',
            'url' => 'https://drive.example.com/summary.pdf',
        ])->assertRedirect();

        $this->actingAs($admin)->post(route('admin.cycle-materials.store', $cycle), [
            'type' => 'material',
            'material_id' => $material->id,
        ])->assertRedirect();

        $this->assertSame(2, $cycle->materialEntries()->count());
        $materialEntry = $cycle->materialEntries()->where('type', 'material')->first();
        $this->assertSame($material->title, $materialEntry->title);
    }

    public function test_admin_can_attach_a_protected_pdf_to_a_cycle(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $cycle = $this->makeCycle();

        $this->actingAs($admin)->post(route('admin.cycle-materials.store', $cycle), [
            'type' => 'pdf',
            'title' => 'ملخص السايكل',
            'pdf' => UploadedFile::fake()->create('summary.pdf', 100, 'application/pdf'),
        ])->assertRedirect();

        $entry = $cycle->materialEntries()->where('type', 'pdf')->firstOrFail();
        $this->assertNotNull($entry->file_path);
        Storage::disk('local')->assertExists($entry->file_path);
    }

    public function test_guest_cannot_view_a_cycles_protected_pdf(): void
    {
        Storage::fake('local');

        $cycle = $this->makeCycle();
        $entry = $cycle->materialEntries()->create([
            'type' => CycleMaterial::TYPE_PDF,
            'title' => 'ملخص',
            'file_path' => 'cycle-materials/'.$cycle->id.'/summary.pdf',
            'position' => 1,
        ]);
        Storage::disk('local')->put($entry->file_path, 'fake pdf content');

        $this->get(route('cycle-materials.view', $entry))->assertRedirect(route('login'));
    }

    public function test_enrolled_student_can_view_a_cycles_protected_pdf(): void
    {
        Storage::fake('local');

        $student = User::role('student')->first();
        $cycle = $this->makeCycle();
        $entry = $cycle->materialEntries()->create([
            'type' => CycleMaterial::TYPE_PDF,
            'title' => 'ملخص',
            'file_path' => 'cycle-materials/'.$cycle->id.'/summary.pdf',
            'position' => 1,
        ]);
        Storage::disk('local')->put($entry->file_path, 'fake pdf content');

        ContentAccess::create([
            'user_id' => $student->id,
            'accessible_type' => Cycle::class,
            'accessible_id' => $cycle->id,
            'source' => ContentAccess::SOURCE_MANUAL,
            'granted_at' => now(),
        ]);

        $response = $this->actingAs($student)->get(route('cycle-materials.view', $entry));
        $response->assertOk();
        $this->assertStringContainsString('inline', $response->headers->get('Content-Disposition'));
    }

    public function test_deleting_a_pdf_cycle_material_removes_its_file(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $cycle = $this->makeCycle();
        $entry = $cycle->materialEntries()->create([
            'type' => CycleMaterial::TYPE_PDF,
            'title' => 'ملخص',
            'file_path' => 'cycle-materials/'.$cycle->id.'/summary.pdf',
            'position' => 1,
        ]);
        Storage::disk('local')->put($entry->file_path, 'fake pdf content');

        $this->actingAs($admin)->delete(route('admin.cycle-materials.destroy', $entry))
            ->assertRedirect();

        Storage::disk('local')->assertMissing($entry->file_path);
        $this->assertDatabaseMissing('cycle_materials', ['id' => $entry->id]);
    }

    private function makeTestZip(array $files): string
    {
        $zipPath = tempnam(sys_get_temp_dir(), 'test').'.zip';
        $zip = new \ZipArchive;
        $zip->open($zipPath, \ZipArchive::CREATE);
        foreach ($files as $name => $contents) {
            $zip->addFromString($name, $contents);
        }
        $zip->close();

        return $zipPath;
    }

    public function test_admin_can_upload_a_single_html_file_for_a_material(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $material = $this->makeMaterial(['price' => 0]);

        $this->actingAs($admin)->post(route('admin.materials.html.store', $material), [
            'file' => UploadedFile::fake()->create('course.html', 50, 'text/html'),
        ])->assertRedirect();

        $material->refresh();
        $this->assertNotNull($material->html_path);
        Storage::disk('local')->assertExists($material->html_path.'/index.html');
    }

    public function test_admin_can_upload_a_multi_file_zip_with_css_for_a_material(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $material = $this->makeMaterial(['price' => 0]);

        $zipPath = $this->makeTestZip([
            'index.html' => '<html><link rel="stylesheet" href="style.css"></html>',
            'style.css' => 'body { color: red; }',
        ]);

        $this->actingAs($admin)->post(route('admin.materials.html.store', $material), [
            'file' => new UploadedFile($zipPath, 'course.zip', 'application/zip', null, true),
        ])->assertRedirect();

        $material->refresh();
        Storage::disk('local')->assertExists($material->html_path.'/index.html');
        Storage::disk('local')->assertExists($material->html_path.'/style.css');
        $this->assertSame(
            'body { color: red; }',
            Storage::disk('local')->get($material->html_path.'/style.css'),
        );
    }

    public function test_zip_wrapped_in_a_single_folder_is_flattened(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $material = $this->makeMaterial(['price' => 0]);

        $zipPath = $this->makeTestZip([
            'my-project/index.html' => '<html></html>',
            'my-project/style.css' => 'body {}',
        ]);

        $this->actingAs($admin)->post(route('admin.materials.html.store', $material), [
            'file' => new UploadedFile($zipPath, 'course.zip', 'application/zip', null, true),
        ])->assertRedirect();

        $material->refresh();
        Storage::disk('local')->assertExists($material->html_path.'/index.html');
        Storage::disk('local')->assertExists($material->html_path.'/style.css');
        Storage::disk('local')->assertMissing($material->html_path.'/my-project/index.html');
    }

    public function test_zip_without_index_html_is_rejected(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $material = $this->makeMaterial(['price' => 0]);

        $zipPath = $this->makeTestZip(['readme.txt' => 'no index here']);

        $this->actingAs($admin)->post(route('admin.materials.html.store', $material), [
            'file' => new UploadedFile($zipPath, 'course.zip', 'application/zip', null, true),
        ])->assertSessionHasErrors('file');

        $this->assertNull($material->refresh()->html_path);
    }

    public function test_guest_cannot_view_a_materials_interactive_html_page(): void
    {
        Storage::fake('local');

        $material = $this->makeMaterial(['price' => 0]);
        $dir = 'materials-html/'.$material->id;
        Storage::disk('local')->put($dir.'/index.html', '<html>course</html>');
        $material->update(['html_path' => $dir]);

        $this->get(route('materials.html-content', $material))
            ->assertRedirect(route('login', ['redirect' => route('materials.show', $material)]));
    }

    public function test_student_with_access_can_view_a_materials_interactive_html_page_and_its_assets(): void
    {
        Storage::fake('local');

        $student = User::role('student')->first();
        $material = $this->makeMaterial(['price' => 0]);
        $dir = 'materials-html/'.$material->id;
        Storage::disk('local')->put($dir.'/index.html', '<html>course</html>');
        Storage::disk('local')->put($dir.'/style.css', 'body {}');
        $material->update(['html_path' => $dir]);

        $this->actingAs($student)->get(route('materials.html-content', $material))->assertOk();
        $this->actingAs($student)
            ->get(route('materials.html-content', [$material, 'style.css']))
            ->assertOk();
    }

    public function test_cannot_escape_a_materials_html_folder_via_path_traversal(): void
    {
        Storage::fake('local');

        $student = User::role('student')->first();
        $material = $this->makeMaterial(['price' => 0]);
        $dir = 'materials-html/'.$material->id;
        Storage::disk('local')->put($dir.'/index.html', '<html>course</html>');
        Storage::disk('local')->put('secret.txt', 'top secret');
        $material->update(['html_path' => $dir]);

        $this->actingAs($student)
            ->get(route('materials.html-content', [$material, '../../secret.txt']))
            ->assertNotFound();
    }

    public function test_replacing_an_interactive_html_page_deletes_the_old_one(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $material = $this->makeMaterial();
        $oldDir = 'materials-html/old-version';
        Storage::disk('local')->put($oldDir.'/index.html', 'old content');
        $material->update(['html_path' => $oldDir]);

        $this->actingAs($admin)->post(route('admin.materials.html.store', $material), [
            'file' => UploadedFile::fake()->create('course.html', 10, 'text/html'),
        ])->assertRedirect();

        Storage::disk('local')->assertMissing($oldDir.'/index.html');
        Storage::disk('local')->assertExists($material->refresh()->html_path.'/index.html');
    }

    public function test_admin_can_delete_a_materials_interactive_html_page(): void
    {
        Storage::fake('local');

        $admin = User::role('admin')->first();
        $material = $this->makeMaterial();
        $dir = 'materials-html/'.$material->id;
        Storage::disk('local')->put($dir.'/index.html', 'content');
        $material->update(['html_path' => $dir]);

        $this->actingAs($admin)->delete(route('admin.materials.html.destroy', $material))
            ->assertRedirect();

        Storage::disk('local')->assertMissing($dir.'/index.html');
        $this->assertNull($material->refresh()->html_path);
    }

    public function test_student_enrolled_in_a_cycle_gets_free_access_to_its_linked_material(): void
    {
        $admin = User::role('admin')->first();
        $student = User::role('student')->first();
        $cycle = $this->makeCycle();
        $material = $this->makeMaterial(['price' => 49]);

        $this->assertFalse($student->hasAccessToMaterial($material));

        $this->actingAs($admin)->post(route('admin.cycle-materials.store', $cycle), [
            'type' => 'material',
            'material_id' => $material->id,
        ]);

        $this->assertFalse($student->hasAccessToMaterial($material));

        ContentAccess::create([
            'user_id' => $student->id,
            'accessible_type' => Cycle::class,
            'accessible_id' => $cycle->id,
            'source' => ContentAccess::SOURCE_MANUAL,
            'granted_at' => now(),
        ]);

        $this->assertTrue($student->hasAccessToCycle($cycle));
        $this->assertTrue($student->hasAccessToMaterial($material));

        $page = $material->pages()->first();
        $this->actingAs($student)->get(route('material-pages.show', $page))->assertOk();
    }

    public function test_student_dashboard_lists_their_cycles_and_materials(): void
    {
        $student = User::role('student')->first();
        $cycle = $this->makeCycle();
        $material = $this->makeMaterial();

        ContentAccess::create([
            'user_id' => $student->id,
            'accessible_type' => Cycle::class,
            'accessible_id' => $cycle->id,
            'source' => ContentAccess::SOURCE_MANUAL,
            'granted_at' => now(),
        ]);
        ContentAccess::create([
            'user_id' => $student->id,
            'accessible_type' => Material::class,
            'accessible_id' => $material->id,
            'source' => ContentAccess::SOURCE_MANUAL,
            'granted_at' => now(),
        ]);

        $this->actingAs($student)->get(route('student.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('cycles.0.id', $cycle->id)
                ->where('materials.0.id', $material->id)
            );
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
