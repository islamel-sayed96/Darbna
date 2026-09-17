<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Placeholder AED pricing — Ziina (the payment gateway wired up)
        // only settles in AED. Adjust these once real price points are set.
        // Each access tier has a flat monthly rate that gets a bigger
        // discount the longer the duration (×1 / ×0.90 / ×0.80 / ×0.65),
        // rounded to whole AED.
        $durations = [
            1 => ['label' => 'شهر', 'multiplier' => 1],
            3 => ['label' => '3 شهور', 'multiplier' => 0.90],
            6 => ['label' => '6 شهور', 'multiplier' => 0.80],
            12 => ['label' => 'سنة', 'multiplier' => 0.65],
        ];

        $tiers = [
            SubscriptionPlan::ACCESS_LIMITED_COURSES => [
                'name' => 'اختيار 3 كورسات',
                'monthly_rate' => 39,
                'course_limit' => 3,
                'path_limit' => null,
                'description' => 'اختار 3 كورسات من أي قسم وابدأ فيهم فورًا.',
                'badge' => null,
            ],
            SubscriptionPlan::ACCESS_SINGLE_PATH => [
                'name' => 'مسار تعليمي واحد',
                'monthly_rate' => 59,
                'course_limit' => null,
                'path_limit' => 1,
                'description' => 'وصول كامل لكل كورسات مسار تعليمي واحد تختاره.',
                'badge' => null,
            ],
            SubscriptionPlan::ACCESS_THREE_PATHS => [
                'name' => '3 مسارات تعليمية',
                'monthly_rate' => 89,
                'course_limit' => null,
                'path_limit' => 3,
                'description' => 'وصول كامل لكل كورسات 3 مسارات تعليمية تختارها.',
                'badge' => 'الأكثر طلبًا',
            ],
            SubscriptionPlan::ACCESS_ALL => [
                'name' => 'كل الكورسات والمسارات',
                'monthly_rate' => 129,
                'course_limit' => null,
                'path_limit' => null,
                'description' => 'وصول كامل مفتوح لكل الكورسات والمسارات التعليمية بدون استثناء.',
                'badge' => 'الأشمل',
            ],
        ];

        foreach ($tiers as $accessType => $tier) {
            foreach ($durations as $months => $duration) {
                $price = (int) round($tier['monthly_rate'] * $months * $duration['multiplier']);
                $slug = "{$accessType}-{$months}m";

                SubscriptionPlan::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => "{$tier['name']} — {$duration['label']}",
                        'price' => $price,
                        'currency' => 'AED',
                        'duration_months' => $months,
                        'access_type' => $accessType,
                        'course_limit' => $tier['course_limit'],
                        'path_limit' => $tier['path_limit'],
                        'description' => $tier['description'],
                        'badge' => $months === 12 ? 'أفضل توفير' : $tier['badge'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
