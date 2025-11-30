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

    public function testSubmitExtendedFeedbackWorks()
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
        $score = (string)rand(0, 4);

        $options = array_map(function ($option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => $comment,
            'language_score' => $score,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => $comment,
            'language_score' => $score,
        ]);
    }

    public function testSubmitExtendedFeedbackWorksWithoutScore()
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

        $options = array_map(function ($option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => $comment,
            'language_score' => null,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => $comment,
            'language_score' => null,
        ]);
    }

    public function testSubmitExtendedFeedbackWorksWithLanguageScoreZero()
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

        $options = array_map(function ($option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => $comment,
            'language_score' => "0",
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => $comment,
            'language_score' => 0,
        ]);
    }

    public function testSubmitExtendedFeedbackWorksWithoutComment()
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

        $options = array_map(function ($option) {
            return $option->value;
        }, FeedbackOptions::cases());

        $response = $this->put("/api/site/$siteId/feedback/" . $feedback->getKey(), [
            'options' => $options,
            'comment' => null,
            'language_score' => null,
        ]);

        $response->assertSuccessful();

        $this->assertDatabaseHas((new Feedback()), [
            'id' => $feedback->getKey(),
            'options' => json_encode($options),
            'comment' => null,
            'language_score' => null,
        ]);
    }
}
