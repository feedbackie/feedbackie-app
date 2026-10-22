<?php

declare(strict_types=1);

namespace Feedbackie\Api\Http\Requests\Api\Reports;

use Feedbackie\Core\Context\ReportFilters;
use Feedbackie\Core\Enums\ReportStatus;
use Illuminate\Foundation\Http\FormRequest;

class ListReportsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'url' => ['nullable', 'string'],
            'start_timestamp' => ['nullable', 'integer'],
            'end_timestamp' => ['nullable', 'integer'],
        ];
    }

    public function getFilters(): ReportFilters
    {
        $data = $this->validated();

        $status = null;
        if ($this->route('status') !== null) {
            $status = ReportStatus::from($this->route('status'));
        }

        return new ReportFilters(
            status: $status,
            url: $data['url'] ?? null,
            startTimestamp: $data['start_timestamp'] ?? null,
            endTimestamp: $data['end_timestamp'] ?? null
        );
    }
}
