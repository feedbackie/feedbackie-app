<?php

declare(strict_types=1);

namespace Database\Factories\Feedbackie\Core\Models;

use Feedbackie\Core\Models\Report;
use Feedbackie\Core\Utils\Differ;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    public $model = Report::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $differ = app()->get(Differ::class);

        $text = fake()->realText(1000);
        $selectedText = substr($text, 10, 300);
        $fullText = str_replace($selectedText, '[sel]' . $selectedText . '[/sel]', $text);

        if (rand(0, 100) === 1) {
            $fixedText = str_replace("Alice", "Robert", $text);
            $diffText =  $differ->compareStrings($text, $fixedText);
        } else {
            $fixedText = $text;
            $diffText = $text;
        }

        return [
            "selected_text" => $selectedText,
            "full_text" => $fullText,
            "fixed_text" => $fixedText,
            "diff_text" => $diffText,
            "url" => fake()->url,
            "comment" => fake()->realText,
            "offset" => fake()->numberBetween(0, 1000),
        ];
    }
}
