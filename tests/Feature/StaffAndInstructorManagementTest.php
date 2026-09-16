<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffAndInstructorManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_admin_can_create_an_instructor_account(): void
    {
        $admin = User::role('admin')->first();

        $response = $this->actingAs($admin)->post(route('admin.instructors.store'), [
            'name' => 'محاضر جديد',
            'email' => 'new.instructor@darbna.test',
        ]);

        $response->assertRedirect(route('admin.instructors.index'));

        $instructor = User::where('email', 'new.instructor@darbna.test')->first();
        $this->assertNotNull($instructor);
        $this->assertTrue($instructor->hasRole('instructor'));
    }

    public function test_public_registration_only_creates_student_accounts(): void
    {
        $response = $this->post(route('register'), [
            'name' => 'مستخدم جديد',
            'email' => 'newuser@darbna.test',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));

        $user = User::where('email', 'newuser@darbna.test')->first();
        $this->assertTrue($user->hasRole('student'));
        $this->assertFalse($user->hasRole('instructor'));
    }

    public function test_instructor_course_route_has_no_delete_action(): void
    {
        $instructor = User::role('instructor')->first();
        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس', 'slug' => 'kors-del-test', 'price' => 0, 'is_free' => true,
            'level' => 'beginner', 'language' => 'ar', 'status' => 'draft',
        ]);

        $this->actingAs($instructor)
            ->delete("/instructor/courses/{$course->id}")
            ->assertStatus(405);
    }

    public function test_admin_can_delete_a_published_course(): void
    {
        $admin = User::role('admin')->first();
        $instructor = User::role('instructor')->first();
        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس منشور', 'slug' => 'kors-del-admin', 'price' => 0, 'is_free' => true,
            'level' => 'beginner', 'language' => 'ar', 'status' => 'published', 'published_at' => now(),
        ]);

        $this->actingAs($admin)->delete(route('admin.courses.destroy', $course))
            ->assertRedirect(route('admin.courses.index'));

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    public function test_moderator_with_review_permission_can_access_course_review_but_not_admin_only_pages(): void
    {
        $admin = User::role('admin')->first();

        $this->actingAs($admin)->post(route('admin.staff.store'), [
            'name' => 'موديريتور',
            'email' => 'mod@darbna.test',
            'permissions' => ['review_courses'],
        ]);

        $moderator = User::where('email', 'mod@darbna.test')->first();

        $this->actingAs($moderator)->get(route('admin.courses.index'))->assertOk();
        $this->actingAs($moderator)->get(route('admin.dashboard'))->assertForbidden();
        $this->actingAs($moderator)->get(route('admin.instructors.index'))->assertForbidden();
    }

    public function test_deactivated_instructor_cannot_log_in(): void
    {
        $instructor = User::factory()->create([
            'password' => bcrypt('password'),
            'is_active' => false,
        ]);
        $instructor->assignRole('instructor');

        $response = $this->post(route('login'), [
            'email' => $instructor->email,
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }
}
