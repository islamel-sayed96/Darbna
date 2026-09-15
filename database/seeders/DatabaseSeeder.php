<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (['admin', 'instructor', 'student'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $admin = User::factory()->create([
            'name' => 'مدير المنصة',
            'email' => 'admin@darbna.test',
        ]);
        $admin->assignRole('admin');

        $instructor = User::factory()->create([
            'name' => 'محاضر تجريبي',
            'email' => 'instructor@darbna.test',
            'headline' => 'مطور ويب ومدرب معتمد',
        ]);
        $instructor->assignRole('instructor');

        $student = User::factory()->create([
            'name' => 'طالب تجريبي',
            'email' => 'student@darbna.test',
        ]);
        $student->assignRole('student');

        $category = Category::firstOrCreate(
            ['slug' => 'web-development'],
            ['name' => 'تطوير الويب']
        );

        $demoCourse = Course::firstOrCreate(
            ['slug' => 'html-css-for-beginners'],
            [
                'instructor_id' => $instructor->id,
                'category_id' => $category->id,
                'title' => 'أساسيات HTML و CSS للمبتدئين',
                'description' => 'كورس تجريبي لعرض شكل المنصة: تشوف فيه فيديو، تختبر تجربة الطالب، وتاخد فكرة عن شكل صفحة الكورس والدرس.',
                'price' => 0,
                'is_free' => true,
                'level' => 'beginner',
                'language' => 'ar',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        if ($demoCourse->sections()->doesntExist()) {
            $section = $demoCourse->sections()->create(['title' => 'مقدمة الكورس', 'position' => 1]);

            $section->lessons()->create([
                'title' => 'الدرس الأول: مقدمة (فيديو تجريبي)',
                'type' => 'video',
                'video_provider' => 'youtube',
                'video_id' => Lesson::extractYoutubeId('https://www.youtube.com/watch?v=aqz-KE-bpKQ'),
                'video_url' => 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
                'position' => 1,
                'is_preview' => true,
            ]);

            $section->lessons()->create([
                'title' => 'الدرس الثاني: نص تجريبي',
                'type' => 'text',
                'content' => 'ده مثال لدرس نصي — ممكن المحاضر يكتب هنا شرح أو ملاحظات بدل فيديو.',
                'position' => 2,
                'is_preview' => false,
            ]);
        }

        SubscriptionPlan::firstOrCreate(
            ['slug' => 'monthly'],
            [
                'name' => 'اشتراك شهري',
                'price' => 199,
                'interval' => 'month',
                'description' => 'وصول كامل لكل الكورسات المنشورة شهريًا.',
                'is_active' => true,
            ]
        );

        SubscriptionPlan::firstOrCreate(
            ['slug' => 'yearly'],
            [
                'name' => 'اشتراك سنوي',
                'price' => 1799,
                'interval' => 'year',
                'description' => 'وصول كامل لكل الكورسات المنشورة بخصم سنوي.',
                'is_active' => true,
            ]
        );

        $this->command?->info("Demo users created (password: 'password'):");
        $this->command?->info('- admin@darbna.test');
        $this->command?->info('- instructor@darbna.test');
        $this->command?->info('- student@darbna.test');
    }
}
