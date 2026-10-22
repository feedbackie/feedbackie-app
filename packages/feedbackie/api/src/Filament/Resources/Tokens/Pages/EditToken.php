<?php

declare(strict_types=1);

namespace Feedbackie\Api\Filament\Resources\Tokens\Pages;

use Feedbackie\Api\Filament\Resources\Tokens\TokenResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditToken extends EditRecord
{
    protected static string $resource = TokenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
