<?php

declare(strict_types=1);

namespace Database\Factories\Feedbackie\Core\Models;

use Feedbackie\Core\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Site>
 */
class SiteFactory extends Factory
{
    protected $model = Site::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->domainName,
            'domain' => fake()->domainName,
            'report_enabled' => true,
            'feedback_enabled' => true,
        ];
    }
}
