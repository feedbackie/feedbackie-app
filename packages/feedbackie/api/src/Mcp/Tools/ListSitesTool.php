<?php

declare(strict_types=1);

namespace Feedbackie\Api\Mcp\Tools;

use Feedbackie\Core\Models\Site;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Gate;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Lists all available sites')]
class ListSitesTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $canAccess = Gate::check(\Feedbackie\Api\Enums\TokenAbilitiesEnum::READ_SITES->value);

        if (false === $canAccess) {
            return Response::error("Your token must have ability: " . \Feedbackie\Api\Enums\TokenAbilitiesEnum::READ_SITES->value);
        }

        $sites = Site::query()->get();

        return Response::structured($sites->map(function (Site $site) {
            return [
                'id' => $site->getKey(),
                'name' => $site->name,
                'domain' => $site->domain,
            ];
        })->toArray());
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
