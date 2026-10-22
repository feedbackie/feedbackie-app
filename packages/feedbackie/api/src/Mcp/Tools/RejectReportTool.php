<?php

declare(strict_types=1);

namespace Feedbackie\Api\Mcp\Tools;

use Feedbackie\Core\Enums\ReportStatus;
use Feedbackie\Core\Models\Report;
use Feedbackie\Core\Services\ReportsService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Gate;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Rejects report when suggested changes where declined')]
class RejectReportTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request, ReportsService $service): Response
    {
        $canAccess = Gate::check(\Feedbackie\Api\Enums\TokenAbilitiesEnum::REJECT_REPORTS->value);
        if (false === $canAccess) {
            return Response::error("Your token must have ability: " . \Feedbackie\Api\Enums\TokenAbilitiesEnum::REJECT_REPORTS->value);
        }

        $report = Report::query()->findOrFail($request->get('report_id'));
        if(null === $report){
            Response::error("Report does not exist!");
        }

        if ($report->status === ReportStatus::REJECTED->value) {
            Response::error("Report is already rejected");
        }

        $service->rejectReport($report);

        return Response::text('Report rejected successfully');
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'report_id' => $schema->string()
                ->required()
                ->description("Report identifier"),
        ];
    }
}
