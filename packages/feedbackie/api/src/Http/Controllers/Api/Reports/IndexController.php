<?php

declare(strict_types=1);

namespace Feedbackie\Api\Http\Controllers\Api\Reports;

use Feedbackie\Api\Http\Requests\Api\Reports\ListReportsRequest;
use Feedbackie\Api\Http\Resources\Reports\ReportResource;
use Feedbackie\Core\Models\Site;
use Feedbackie\Core\Services\ReportsService;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function __invoke(string $siteId, string $status, ListReportsRequest $request, ReportsService $service)
    {
        $site = Site::query()->findOrFail($siteId);

        $filters = $request->getFilters();

        $reports = $service->listReports($site, $filters, 10);

        return ReportResource::collection($reports);
    }
}
