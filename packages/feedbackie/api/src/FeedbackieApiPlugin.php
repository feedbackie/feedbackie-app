<?php

declare(strict_types=1);

namespace Feedbackie\Api;

use Feedbackie\Api\Filament\Resources\Tokens\TokenResource;
use Filament\Contracts\Plugin;
use Filament\Panel;

class FeedbackieApiPlugin implements Plugin
{
    public function getId(): string
    {
        return 'feedbackie-api';
    }

    public function register(Panel $panel): void
    {
        $panel
            ->resources([
                TokenResource::class,
            ]);
    }

    public function boot(Panel $panel): void
    {
        //
    }

    public static function make(): static
    {
        return resolve(static::class);
    }
}

