<?php

declare(strict_types=1);

namespace Feedbackie\Api\Context;

use Feedbackie\Core\Enums\ReportStatus;

class ReportFilters
{
    public function __construct(
        public ?ReportStatus $status = null,
        public ?string $url = null,
        public ?int $startTimestamp = null,
        public ?int $endTimestamp = null,
    ) {
    }
}
