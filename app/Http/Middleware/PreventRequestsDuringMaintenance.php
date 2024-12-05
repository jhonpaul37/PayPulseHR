<?php

namespace App\Http\Middleware;

use Closure;

class PreventRequestsDuringMaintenance
{
    public function handle($request, Closure $next)
    {
        if (app()->isDownForMaintenance()) {
            abort(503);
        }

        return $next($request);
    }
}
