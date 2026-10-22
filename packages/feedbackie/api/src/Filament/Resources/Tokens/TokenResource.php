<?php

declare(strict_types=1);

namespace Feedbackie\Api\Filament\Resources\Tokens;

use Feedbackie\Api\Filament\Resources\Tokens\Pages\CreateToken;
use Feedbackie\Api\Filament\Resources\Tokens\Pages\EditToken;
use Feedbackie\Api\Filament\Resources\Tokens\Pages\ListTokens;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Laravel\Sanctum\PersonalAccessToken;
use BackedEnum;

class TokenResource extends Resource
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-globe-europe-africa';

    public static function getModel(): string
    {
        return PersonalAccessToken::class;
    }

    public static function getNavigationLabel(): string
    {
        return \__('feedbackie-api::labels.resources.tokens.navigation_label');
    }

    public static function getLabel(): string
    {
        return \__('feedbackie-api::labels.resources.tokens.record_label');
    }

    public static function getPluralLabel(): string
    {
        return \__('feedbackie-api::labels.resources.tokens.record_plural_label');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make("name")
                    ->label(\__('feedbackie-api::labels.resources.tokens.name'))
                    ->disabled()
                    ->columnSpanFull()
                    ->required(),
                TextInput::make("abilities")
                    ->label(\__('feedbackie-api::labels.resources.tokens.abilities'))
                    ->disabled()
                    ->columnSpanFull()
                    ->required(),
                TextInput::make("last_used_at")
                    ->label(\__('feedbackie-api::labels.resources.tokens.last_used_at'))
                    ->disabled()
                    ->columnSpanFull()
                    ->required(),
                TextInput::make("expires_at")
                    ->label(\__('feedbackie-api::labels.resources.tokens.expires_at'))
                    ->disabled()
                    ->columnSpanFull()
                    ->required(),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("name")
                    ->label(\__('feedbackie-api::labels.resources.tokens.name')),
                TextColumn::make("tokenable.login")
                    ->label(\__('feedbackie-api::labels.resources.tokens.owner')),
                TextColumn::make("abilities")
                    ->wrap(true)
                    ->label(\__('feedbackie-api::labels.resources.tokens.abilities')),
                TextColumn::make("last_used_at")
                    ->label(\__('feedbackie-api::labels.resources.tokens.last_used_at')),
                TextColumn::make("expires_at")
                    ->label(\__('feedbackie-api::labels.resources.tokens.expires_at')),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTokens::route('/'),
            'edit' => EditToken::route('/{record}/edit'),
            'create' => CreateToken::route('/create'),
        ];
    }
}
