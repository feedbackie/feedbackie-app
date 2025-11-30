<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\User;
use Feedbackie\Core\Models\Metadata;
use Feedbackie\Core\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmitReportTest extends TestCase
{
    use RefreshDatabase;

    public function testSubmitReportWorks()
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();

        $url = "https://" . $site->domain . "/" . fake()->word . '/' . fake()->word;
        $text = fake()->realText(500);
        $ls = time();
        $ts = time();
        $ss = fake()->uuid;

        $response = $this->post("api/site/$siteId/report", [
            'selected_text' => 'test',
            'full_text' => $text,
            'fixed_text' => $text,
            'comment' => 'comment',
            'offset' => 14,
            'url' => $url,
            'ls' => $ls,
            'ts' => $ts,
            'ss' => $ss
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas('reports', [
            'site_id' => $site->getKey(),
            'selected_text' => 'test',
            'full_text' => htmlspecialchars($text),
            'fixed_text' => htmlspecialchars($text),
            'comment' => 'comment',
            'offset' => 14,
            'url' => $url
        ]);

        $this->assertDatabaseHas((new Metadata())->getTable(), [
            'ss' => $ss,
            'ls' => $ls,
            'ts' => $ts,
            'country' => 'Unrecognized',
            'ip' => '127.0.0.0'
        ]);
    }

    public function testSubmitReportWorksWithoutTexts()
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();
        $siteId = $site->getKey();

        $response = $this->post("api/site/$siteId/report", [
            'site_id' => $site->getKey(),
            'selected_text' => '',
            'full_text' => '',
            'fixed_text' => '',
            'comment' => '',
            'offset' => 14,
            'url' => fake()->url
        ]);

        $response->assertSuccessful();
    }
}
