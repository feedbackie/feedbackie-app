<?php

declare(strict_types=1);

use Laravel\Mcp\Facades\Mcp;

Mcp::web('/mcp', \Feedbackie\Api\Mcp\Servers\FeedbackieServer::class)
    ->middleware('auth:sanctum');
