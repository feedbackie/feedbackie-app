<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\User;
use Feedbackie\Core\Models\Feedback;
use Feedbackie\Core\Models\Metadata;
use Feedbackie\Core\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmitFeedbackTest extends TestCase
{
    use RefreshDatabase;

    public function testSubmitFeedbackYesWorks()
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();

        $url = "https://" . $site->domain . "/" . fake()->word . '/' . fake()->word;

        $response = $this->post("/api/site/$siteId/feedback", [
            "url" => $url,
            "answer" => "yes",
            'ss' => fake()->uuid,
            'ts' => time(),
            'ls' => time(),
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback())->getTable(), [
            'url' => $url,
            'site_id' => $site->getKey(),
            'answer' => 'yes'
        ]);

    }

    public function testSubmitFeedbackNoWorks()
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();
        $siteId = $site->getKey();

        $url = "https://" . $site->domain . "/" . fake()->word . '/' . fake()->word;
        $ls = time();
        $ts = time();
        $ss = fake()->uuid;

        $response = $this->post("/api/site/$siteId/feedback", [
            "url" => $url,
            "site_id" => $site->getKey(),
            "answer" => "no",
            'ls' => $ls,
            'ts' => $ts,
            'ss' => $ss,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback())->getTable(), [
            'url' => $url,
            'site_id' => $site->getKey(),
            'answer' => 'no'
        ]);
        $this->assertDatabaseHas((new Metadata())->getTable(), [
            'ss' => $ss,
            'ls' => $ls,
            'ts' => $ts,
            'country' => 'Unrecognized',
            'ip' => '127.0.0.0'
        ]);
    }

    public function testSubmitFeedbackAnythingDoesNotWork()
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();
        $siteId = $site->getKey();

        $url = "https://" . $site->domain . "/" . fake()->word . '/' . fake()->word;
        $ls = time();
        $ts = time();
        $ss = fake()->uuid;

        $response = $this->post("/api/site/$siteId/feedback", [
            "url" => $url,
            "answer" => "anything",
            'ls' => $ls,
            'ts' => $ts,
            'ss' => $ss,
        ]);

        $response->assertUnprocessable();
    }
}
