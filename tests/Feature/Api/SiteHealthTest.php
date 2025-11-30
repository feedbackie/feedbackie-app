<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\User;
use Feedbackie\Core\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteHealthTest extends TestCase
{
    use RefreshDatabase;

    public function testSiteHealthCheckWorks()
    {
        $user = User::factory()->create();
        $site = Site::factory()->for($user)->create();
        $siteId = $site->getKey();

        $response = $this->get("api/site/$siteId/health", []);

        $response->assertSuccessful();
    }
}
