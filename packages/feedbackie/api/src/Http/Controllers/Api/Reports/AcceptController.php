<?php

declare(strict_types=1);

namespace Feedbackie\Api\Http\Controllers\Api\Reports;

use Feedbackie\Core\Contracts\CanManageReports;
use Feedbackie\Core\Enums\ReportStatus;
use Feedbackie\Core\Models\Report;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AcceptController extends Controller
{
    public function __invoke(string $reportId, CanManageReports $reports){
        $report = Report::query()->findOrFail($reportId);

        if($report->status === ReportStatus::ACCEPTED->value){
            throw new BadRequestHttpException();
        }

        $reports->acceptReport($report);

        return response()->json([
            'success' => true,
        ]);
    }
}
