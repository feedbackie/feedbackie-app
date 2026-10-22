<?php

namespace Feedbackie\Api\Mcp\Servers;

use Feedbackie\Api\Mcp\Tools\AcceptReportTool;
use Feedbackie\Api\Mcp\Tools\ListAcceptedReportsTool;
use Feedbackie\Api\Mcp\Tools\ListNewReportsTool;
use Feedbackie\Api\Mcp\Tools\ListRejectedReportsTool;
use Feedbackie\Api\Mcp\Tools\ListReportsTool;
use Feedbackie\Api\Mcp\Tools\ListSitesTool;
use Feedbackie\Api\Mcp\Tools\RejectReportTool;
use Feedbackie\Core\Filament\Resources\Reports\Pages\ListAcceptedReports;
use Feedbackie\Core\Filament\Resources\Reports\Pages\ListNewReports;
use Feedbackie\Core\Filament\Resources\Reports\Pages\ListRejectedReports;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('Feedbackie Server')]
#[Version('0.0.1')]
#[Instructions('This server can list and manage mistakes reports, feedback and sites.')]
class FeedbackieServer extends Server
{
    protected array $tools = [
        ListReportsTool::class,
        ListAcceptedReportsTool::class,
        ListNewReportsTool::class,
        ListRejectedReportsTool::class,
        AcceptReportTool::class,
        RejectReportTool::class,
        ListSitesTool::class,
    ];

    protected array $resources = [
        //
    ];

    protected array $prompts = [
        //
    ];
}
