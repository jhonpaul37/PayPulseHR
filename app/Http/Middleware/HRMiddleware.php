<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HRMiddleware
{
    public function handle($request, Closure $next)
    {
        $employee = $request->user()->employee;

        if (!$employee ||  ($employee->role !== 'HR' && $employee->role !== 'SuperAdmin')) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
