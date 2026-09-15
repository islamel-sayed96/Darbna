<?php

namespace Database\Seeders;

use App\Models\Category;
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

        Category::firstOrCreate(
            ['slug' => 'web-development'],
            ['name' => 'تطوير الويب']
        );

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
