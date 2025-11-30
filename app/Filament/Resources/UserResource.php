<?php

declare(strict_types=1);

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Tables\Actions\DeleteAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->columns(1)
            ->schema([
                TextInput::make('login')
                    ->label(__('labels.users.login'))
                    ->disabledOn('edit')
                    ->required(),
                TextInput::make('name')
                    ->label(__('labels.users.name'))
                    ->required(),
                TextInput::make('email')
                    ->label(__('labels.users.email'))
                    ->required(),
                TextInput::make('password')
                    ->label(__('labels.users.password'))
                    ->confirmed()
                    ->password()
                    ->required(function (string $operation) {
                        return $operation === 'create';
                    })
                    ->dehydrateStateUsing(function ($state) {
                        return bcrypt($state);
                    })
                    ->dehydrated(function ($state) {
                        return filled($state);
                    }),
                TextInput::make('password_confirmation')
                    ->label(__('labels.users.password_confirmation'))
                    ->password()
                    ->required(function (string $operation) {
                        return $operation === 'create';
                    })
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label(\__('labels.users.name')),
                TextColumn::make('email')
                    ->label(\__('labels.users.email')),
                TextColumn::make('created_at')
                    ->label(\__('labels.users.created_at')),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function (User $record, DeleteAction $action) {
                        if ($record->sites()->count() > 0) {
                            Notification::make()
                                ->danger()
                                ->title(\__('labels.users.errors.user_cannot_be_deleted'))
                                ->body(\__('labels.users.errors.user_has_sites'))
                                ->send();

                            $action->cancel();
                        }
                    }),
            ])
            ->bulkActions([]);
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
