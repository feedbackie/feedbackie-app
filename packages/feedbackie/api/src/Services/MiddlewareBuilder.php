<?php

declare(strict_types=1);

namespace Feedbackie\Api\Services;

use Feedbackie\Api\Enums\TokenAbilitiesEnum;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

class MiddlewareBuilder
{
    public static function buildAbilityCheck(array $abilities): string
    {
        $middleware = CheckAbilities::class . ':';

        foreach($abilities as $ability) {
            if ($ability instanceof TokenAbilitiesEnum) {
                $middleware .= $ability->value . ',';
            } else {
                $middleware .= $ability . ',';
            }
        }

        return rtrim($middleware, ',');
    }
}
