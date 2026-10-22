<?php

declare(strict_types=1);

namespace Feedbackie\Api\Filament\Resources\Tokens\Pages;

use Feedbackie\Api\Filament\Resources\Tokens\TokenResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTokens extends ListRecords
{
    protected static string $resource = TokenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
