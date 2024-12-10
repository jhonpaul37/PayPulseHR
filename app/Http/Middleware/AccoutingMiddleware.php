<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccoutingMiddleware
{
    public function handle($request, Closure $next)
    {
        $employee = $request->user()->employee;

        if (!$employee || ($employee->role !== 'Accounting' && $employee->role !== 'SuperAdmin')) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
