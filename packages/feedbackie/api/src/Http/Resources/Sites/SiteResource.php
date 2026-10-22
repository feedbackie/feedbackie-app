<?php

declare(strict_types=1);

namespace Feedbackie\Api\Http\Resources\Sites;

use Feedbackie\Core\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @property-read Site $resource */
class SiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'name' => $this->resource->name,
            'domain' => $this->resource->domain,
        ];
    }
}
