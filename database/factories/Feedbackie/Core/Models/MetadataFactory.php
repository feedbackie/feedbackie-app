<?php

declare(strict_types=1);

namespace Database\Factories\Feedbackie\Core\Models;

use Feedbackie\Core\Models\Metadata;
use foroco\BrowserDetection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Metadata>
 */
class MetadataFactory extends Factory
{
    public $model = Metadata::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userAgent = fake()->userAgent;

        $parser = new BrowserDetection();
        $browserInfo = $parser->getBrowser($userAgent);

        $browser = ($browserInfo["browser_name"] ?? null) . " " . ($browserInfo["browser_version"] ?? null);
        $device = $parser->getDevice($userAgent)["device_type"] ?? null;
        $os = $parser->getOS($userAgent)["os_name"] ?? null;

        return [
            'user_agent' => $userAgent,
            'country' => fake()->country,
            'language' => fake()->languageCode,
            'ip' => fake()->ipv4,
            'os' => $os,
            'device' => $device,
            'browser' => $browser,
            'ss' => fake()->uuid,
            'ls' => time(),
            'ts' => time(),
        ];
    }
}
