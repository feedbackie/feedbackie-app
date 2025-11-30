<?php

declare(strict_types=1);

namespace App\Configuration;

use Illuminate\Encryption\Encrypter;

class EncryptionConfiguration
{
    const FILE_PATH = 'encryption_key';
    const CIPHER = 'AES-256-CBC';

    public static function getCipher(): string
    {
        return self::CIPHER;
    }

    public static function loadEncryptionKey(): ?string
    {
        if (env('APP_KEY', false) !== false) {
            return env('APP_KEY');
        }

        if (false === file_exists(storage_path(''))) {
            return null;
        }

        $filePath = storage_path(self::FILE_PATH);

        if (false === file_exists($filePath)) {
            $key = self::createEncryptionKey();

            file_put_contents($filePath, $key);
        }

        return file_get_contents($filePath);
    }

    public static function loadPreviousKeys(): array
    {
        return [];
    }

    private static function createEncryptionKey(): string
    {
        return 'base64:' . base64_encode(
                Encrypter::generateKey(self::CIPHER)
            );
    }
}

