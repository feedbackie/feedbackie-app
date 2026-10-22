<?php

declare(strict_types=1);

namespace Feedbackie\Api\Http\Resources\Reports;

use Feedbackie\Core\Models\Report;
use Illuminate\Http\Resources\Json\JsonResource;

/** @property-read Report $resource */
class ReportResource extends JsonResource
{
    public function toArray($request){
        return [
            'id' => $this->resource->getKey(),
            'url' => $this->resource->url,
            'status' => $this->resource->status,
            'selected_text' => $this->resource->selected_text,
            'fixed_text' => $this->resource->fixed_text,
            'comment' => $this->resource->comment,
            'created_at' => $this->resource->created_at,
        ];
    }
}
