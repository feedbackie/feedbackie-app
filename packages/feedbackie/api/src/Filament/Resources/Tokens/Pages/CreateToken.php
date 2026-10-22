<?php

declare(strict_types=1);

namespace Feedbackie\Api\Filament\Resources\Tokens\Pages;

use App\Models\User;
use Carbon\Carbon;
use Feedbackie\Api\Filament\Resources\Tokens\TokenResource;
use Feedbackie\Api\Enums\TokenAbilitiesEnum;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;

class CreateToken extends CreateRecord
{
    protected static string $resource = TokenResource::class;

    protected ?string $createdToken = null;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('name')
                    ->columnSpanFull()
                    ->required(),
                Select::make('user')
                    ->required()
                    ->columnSpanFull()
                    ->options(User::all()->pluck('name', 'id')),
                Select::make('abilities')
                    ->required()
                    ->columnSpanFull()
                    ->multiple()
                    ->options(TokenAbilitiesEnum::getAbilities()),
                DateTimePicker::make('expires_at')
                    ->label(\__('feedbackie-api::labels.resources.tokens.expires_at'))
                    ->columnSpanFull()
                    ->native(false)
                    ->nullable(),
            ]);
    }

    protected function handleRecordCreation(array $data): Model
    {
        /** @var User $user */
       $user = User::find($data['user']);

       if(null === $user) {
              throw new \Exception("User not found");
       }

       if(null !== $data['expires_at']) {
           $data['expires_at'] = Carbon::parse($data['expires_at']);
       }

       $newToken = $user->createToken($data['name'], $data['abilities'], $data['expires_at']);

       $this->createdToken = $newToken->plainTextToken;

       return $newToken->accessToken;
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title(\__('feedbackie-api::labels.resources.tokens.created_notification_title'))
            ->body(\__('feedbackie-api::labels.resources.tokens.created_notification_message', ['token' => $this->createdToken]));
    }

    public function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
