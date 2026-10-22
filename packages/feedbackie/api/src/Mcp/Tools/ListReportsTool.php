<?php

declare(strict_types=1);

namespace Feedbackie\Api\Mcp\Tools;

use Feedbackie\Core\Context\ReportFilters;
use Feedbackie\Core\Enums\ReportStatus;
use Feedbackie\Core\Models\Report;
use Feedbackie\Core\Models\Site;
use Feedbackie\Core\Services\ReportsService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Gate;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Lists all available reports')]
class ListReportsTool extends Tool
{
    public function getStatus(): ?ReportStatus
    {
        return null;
    }

    /**
     * Handle the tool request.
     */
    public function handle(Request $request, ReportsService $service): Response|ResponseFactory
    {
        $canAccess = Gate::check(\Feedbackie\Api\Enums\TokenAbilitiesEnum::READ_REPORTS->value);

        if (false === $canAccess) {
            return Response::error("Your token must have ability: " . \Feedbackie\Api\Enums\TokenAbilitiesEnum::READ_REPORTS->value);
        }

        $siteId = $request->get('site_id');

        $site = Site::query()->find($siteId);

        if (null === $site) {
            return Response::error("Site $siteId not found!");
        }

        $filters = new ReportFilters(
            status: $this->getStatus(),
            url: $request->get('url'),
            startTimestamp: $request->get('end_timestamp'),
            endTimestamp: $request->get('start_timestamp'),
        );

        $reports = $service->listReports($site, $filters);

        return Response::structured([
            'current_page' => $reports->currentPage(),
            'data' => $reports->map(function (Report $report) {
                return [
                    'id' => $report->getKey(),
                    'url' => $report->url,
                    'status' => $report->status,
                    'selected_text' => $report->selected_text,
                    'fixed_text' => $report->fixed_text,
                    'comment' => $report->comment,
                    'created_at' => $report->created_at,
                ];
            }),
            'from' => $reports->firstItem(),
            'last_page' => $reports->lastPage(),
            'per_page' => $reports->perPage(),
            'total' => $reports->total(),
        ]);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'site_id' => $schema->string()
                ->required()
                ->description("Site identifier"),
            'url' => $schema->string()
                ->description('The url to get reports for'),
            'start_date' => $schema->integer()
                ->description('UNIX timestamp of start date, when needed limit period'),
            'end_date' => $schema->integer()
                ->description('UNIX timestamp of start date, when needed limit period'),
            'page' => $schema->integer()
                ->description('Page number')
        ];
    }
}
