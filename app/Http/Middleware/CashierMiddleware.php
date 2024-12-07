<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CashierMiddleware
{
    public function handle($request, Closure $next)
    {
        $employee = $request->user()->employee;

        if (!$employee || $employee->role !== 'Cashier') {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
