<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

class Authenticate
{
    public function handle($request, Closure $next, ...$guards)
    {
        if (Auth::guard()->guest()) {
            throw new AuthenticationException('Unauthenticated.', $guards);
        }

        return $next($request);
    }
}
