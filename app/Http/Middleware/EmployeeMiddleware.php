<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EmployeeMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $employee = $request->user()->employee;

        if (!$employee || $employee->role !== 'employee') {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
