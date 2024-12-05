<?php

namespace App\Http\Middleware;

use Closure;

class CheckForMaintenanceMode
{
    public function handle($request, Closure $next)
    {
        if (app()->isDownForMaintenance()) {
            abort(503, 'Application is in maintenance mode.');
        }

        return $next($request);
    }
}
