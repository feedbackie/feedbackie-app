<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\User;
use Feedbackie\Core\Enums\FeedbackOptions;
use Feedbackie\Core\Models\Feedback;
use Feedbackie\Core\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmitExtendedFeedbackTest extends TestCase
{
    use RefreshDatabase;

    public function testSubmitExtendedFeedbackWorks(): void
    {
        $user = User::factory()
            ->create();

        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();

        $feedback = Feedback::factory()
            ->for($site)
            ->for($user)
            ->create();

        $comment = fake()->realText(500);

        $options = array_map(function (FeedbackOptions $option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => $comment,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => $comment,
        ]);
    }

    public function testSubmitExtendedFeedbackWorksWithoutScore(): void
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();

        $feedback = Feedback::factory()
            ->for($site)
            ->for($user)
            ->create();

        $comment = fake()->realText(500);

        $options = array_map(function (FeedbackOptions $option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => $comment,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => $comment,
        ]);
    }

    public function testSubmitExtendedFeedbackWorksWithLanguageScoreZero(): void
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();

        $feedback = Feedback::factory()
            ->for($site)
            ->for($user)
            ->create();

        $comment = fake()->realText(500);

        $options = array_map(function (FeedbackOptions $option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => $comment,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => $comment,
        ]);
    }

    public function testSubmitExtendedFeedbackWorksWithoutComment(): void
    {
        $user = User::factory()
            ->create();
        $site = Site::factory()
            ->for($user)
            ->create();

        $siteId = $site->getKey();

        $feedback = Feedback::factory()
            ->for($site)
            ->for($user)
            ->create();

        $options = array_map(function (FeedbackOptions $option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => null,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => null,
        ]);
    }
}
