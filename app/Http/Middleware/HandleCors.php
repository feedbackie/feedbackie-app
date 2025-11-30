<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Factories\CorsConfigFactory;
use Closure;

class HandleCors extends \Illuminate\Http\Middleware\HandleCors
{
    public function handle($request, Closure $next)
    {
        if (!$this->hasMatchingPath($request)) {
            return $next($request);
        }

        $configFactory = new CorsConfigFactory($request);

        $this->cors->setOptions($configFactory->makeCorsConfig());

        if ($this->cors->isPreflightRequest($request)) {
            $response = $this->cors->handlePreflightRequest($request);

            $this->cors->varyHeader($response, 'Access-Control-Request-Method');

            return $response;
        }

        $response = $next($request);

        if ($request->getMethod() === 'OPTIONS') {
            $this->cors->varyHeader($response, 'Access-Control-Request-Method');
        }

        return $this->cors->addActualRequestHeaders($response, $request);
    }
}
