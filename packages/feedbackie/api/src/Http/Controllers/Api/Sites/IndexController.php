<?php

declare(strict_types=1);

namespace Feedbackie\Api\Http\Controllers\Api\Sites;

use Feedbackie\Api\Http\Resources\Sites\SiteResource;
use Feedbackie\Core\Models\Site;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function __invoke()
    {
        $sites = Site::query()->get();

        return SiteResource::collection($sites);
    }
}
