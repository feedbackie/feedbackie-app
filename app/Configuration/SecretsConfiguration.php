<?php

declare(strict_types=1);

namespace App\Configuration;

class SecretsConfiguration
{
    public static function readFromEnvOrSecret(string $key, string $default = null): ?string
    {
        $value = env($key);

        if ($value !== null) {
            return $value;
        }

        $filePath = env($key . '_FILE');

        if ($filePath === null || false === file_exists($filePath)) {
            return $default;
        }

        $content = file_get_contents($filePath);

        if ($content !== false) {
            return trim($content);
        }

        return $default;
    }
}
