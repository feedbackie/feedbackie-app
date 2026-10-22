<?php

declare(strict_types=1);

namespace Feedbackie\Api\Mcp\Tools;

use Feedbackie\Core\Enums\ReportStatus;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Lists rejected reports')]
class ListRejectedReportsTool extends ListReportsTool
{
    public function getStatus(): ?ReportStatus
    {
        return ReportStatus::REJECTED;
    }
}
