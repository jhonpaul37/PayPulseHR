<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HRMiddleware
{
    public function handle($request, Closure $next)
    {
        $employee = $request->user()->employee;

        if (!$employee || ($employee->role !== 'HR' && $employee->role !== 'employee')) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
