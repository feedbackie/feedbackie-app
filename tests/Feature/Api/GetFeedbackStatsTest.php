<?php

declare(strict_types=1);

namespace Feature\Api;

use App\Models\User;
use Feedbackie\Core\Enums\FeedbackOptions;
use Feedbackie\Core\Models\Feedback;
use Feedbackie\Core\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GetFeedbackStatsTest extends TestCase
{
    use RefreshDatabase;

    public function testGetFeedbackStatsWorks(){
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();
        $url = fake()->url;

        $feedback1 = Feedback::factory()
            ->for($site)
            ->for($user)
            ->url($url)
            ->helpful()
            ->create();
        $feedback2 = Feedback::factory()
            ->for($site)
            ->for($user)
            ->url($url)
            ->notHelpful()
            ->create();

        $response = $this->get("/api/site/$siteId/feedback?url=" . urlencode($url));

        $response->assertSuccessful();

        $response->assertJsonFragment([
            'success' => true,
            'helpful_count' => 1,
            'not_helpful_count' => 1,
        ]);
    }
}
