<?php

declare(strict_types=1);

namespace Database\Factories\Feedbackie\Core\Models;

use Feedbackie\Core\Enums\FeedbackOptions;
use Feedbackie\Core\Models\Feedback;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\Feedbackie\Core\Models\Feedback>
 */
class FeedbackFactory extends Factory
{
    public $model = Feedback::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $url = fake()->url;
        return [
            'answer' => $this->getRandomAnswer(),
            'url' => $url,
            'url_hash' => md5($url),
            'hash' => fake()->md5,
        ];
    }

    public function extended()
    {
        return $this->state(function (array $attributes): array {
            return [
                'comment' => $this->getRandomComment(),
                'options' => $this->getRandomOptions(),
            ];
        });
    }

    public function url(string $url): self
    {
        return $this->state(function (array $attributes) use($url) : array {
            return [
                'url' => $url,
                'url_hash' => md5($url),
            ];
        });
    }

    public function helpful()
    {
        return $this->state(function (array $attributes): array {
            return [
                'answer' => 'yes',
            ];
        });
    }

    public function notHelpful()
    {
        return $this->state(function (array $attributes): array {
            return [
                'answer' => 'no',
            ];
        });
    }

    private function getRandomAnswer(): string
    {
        return rand(0, 1) === 1 ? "yes" : "no";
    }

    private function getRandomOptions(): array
    {
        $options = [];

        if (rand(0, 2) === 2) {
            $optionsCount = rand(0, count(FeedbackOptions::cases()));
            foreach (range(0, $optionsCount) as $item) {
                $options[] = FeedbackOptions::cases()[abs(rand(0, $optionsCount - 1))]->value;
            }
        }

        return array_values(array_unique($options));
    }

    private function getRandomComment(): ?string
    {
        if (rand(0, 10) === 3) {
            return fake()->realText;
        }

        return null;
    }
}
