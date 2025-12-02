<?php

return [
    'user_model' => "App\\Models\\User",
    'site_model' => "Feedbackie\\Core\\Models\\Site",
    'feedback_model' => "Feedbackie\\Core\\Models\\Feedback",
    'report_model' => "Feedbackie\\Core\\Models\\Report",
    'metadata_model' => "Feedbackie\\Core\\Models\\Metadata",
    'api' => [
        'reports_middleware' => [],
        'feedbacks_middleware' => [],
    ],

    'asset_url' => "build/assets/app.js",
];
