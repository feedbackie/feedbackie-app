<?php

declare(strict_types=1);

namespace App\Factories;

use Feedbackie\Core\Models\Site;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class CorsConfigFactory
{
    private Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function makeCorsConfig(): array
    {
        $config = \config("cors");
        $config['allowed_origins'] = $this->resolveAllowedOrigins($config);

        return $config;
    }

    private function resolveAllowedOrigins(array $config): ?array
    {
        $siteId = $this->tryRetrieveSiteIdFromRequest();

        if (null === $siteId) {
            return $config['allowed_origins'];
        }

        $site = Site::find($siteId);

        if ($site === null) {
            return [];
        }

        return [$site->domain];
    }

    private function tryRetrieveSiteIdFromRequest(): ?string
    {
        $path = $this->request->getPathInfo();
        $parts = explode("/", $path);
        $siteIndex = array_search("site", $parts, true);

        if (null == $siteIndex) {
            return null;
        }

        $siteId = $parts[$siteIndex + 1];
        if (false === Uuid::isValid($siteId)) {
            return null;
        }

        return $siteId;
    }
}
