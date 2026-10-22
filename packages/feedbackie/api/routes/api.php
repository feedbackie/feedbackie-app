<?php

declare(strict_types=1);

Route::prefix('api/v1')->group(function () {
    Route::get('/sites', [
        \Feedbackie\Api\Http\Controllers\Api\Sites\IndexController::class,
        '__invoke'
    ])
        ->name('sites.index')
        ->middleware(['auth:sanctum', \Feedbackie\Api\Services\MiddlewareBuilder::buildAbilityCheck([
            \Feedbackie\Api\Enums\TokenAbilitiesEnum::READ_SITES,
        ])]);

    Route::get('sites/{site}/reports/{status}', [
        \Feedbackie\Api\Http\Controllers\Api\Reports\IndexController::class,
        '__invoke'
    ])
        ->name('reports.index')
        ->middleware(['auth:sanctum', \Feedbackie\Api\Services\MiddlewareBuilder::buildAbilityCheck([
            \Feedbackie\Api\Enums\TokenAbilitiesEnum::READ_REPORTS,
        ])])
        ->where("site", \Feedbackie\Core\Utils\Uuid::getRegex())
        ->where('status', \Feedbackie\Core\Enums\ReportStatus::getRegex());


    Route::post('/reports/{id}/accept', [
        \Feedbackie\Api\Http\Controllers\Api\Reports\AcceptController::class,
        '__invoke'
    ])
        ->name('reports.accept')
        ->middleware(['auth:sanctum', \Feedbackie\Api\Services\MiddlewareBuilder::buildAbilityCheck([
            \Feedbackie\Api\Enums\TokenAbilitiesEnum::ACCEPT_REPORTS,
        ])])
        ->where("id", \Feedbackie\Core\Utils\Uuid::getRegex());

    Route::post('/reports/{id}/reject', [
        \Feedbackie\Api\Http\Controllers\Api\Reports\RejectController::class,
        '__invoke'
    ])
        ->name('reports.reject')
        ->middleware(['auth:sanctum', \Feedbackie\Api\Services\MiddlewareBuilder::buildAbilityCheck([
            \Feedbackie\Api\Enums\TokenAbilitiesEnum::REJECT_REPORTS,
        ])])
        ->where("id", \Feedbackie\Core\Utils\Uuid::getRegex());
});
