<?php

declare(strict_types=1);

namespace Feedbackie\Api\Providers;

use App\Models\User;
use Feedbackie\Api\Enums\TokenAbilitiesEnum;
use Feedbackie\Core\Contracts\CanRetrieveFeedbackStats;
use Feedbackie\Core\Services\FeedbackService;
use Feedbackie\Core\Services\GeoipService;
use Feedbackie\Core\Services\MetadataService;
use Feedbackie\Core\Services\SitesStorage;
use Feedbackie\Core\Utils\Colors;
use Feedbackie\Core\Configuration\FeedbackieConfiguration;
use Feedbackie\Core\Console\Commands\DownloadGeoIpDatabaseCommand;
use Feedbackie\Core\Http\Livewire\SiteSelector;
use Feedbackie\Core\Models\Feedback;
use Feedbackie\Core\Models\Metadata;
use Feedbackie\Core\Models\Report;
use Feedbackie\Core\Models\Site;
use Feedbackie\Core\Observers\FillUserIdFromSession;
use Feedbackie\Core\Observers\FillUserIdFromSite;
use Filament\Support\Facades\FilamentColor;
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;

class FeedbackieApiProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/sanctum.php', 'sanctum'
        );

        foreach (TokenAbilitiesEnum::cases() as $ability) {
            Gate::define($ability->value, function (User $user) use ($ability): bool {
                return $user->tokenCan($ability->value);
            });
        }
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        $this->loadRoutesFrom(__DIR__ . '/../../routes/api.php');
        $this->loadRoutesFrom(__DIR__ . '/../../routes/ai.php');
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'feedbackie-api');
    }
}
