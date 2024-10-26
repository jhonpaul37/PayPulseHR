<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Check if the user has an associated employee record with a matching role
            $userRole = Auth::user()->employee->role ?? null;
            if ($userRole && in_array($userRole, $roles)) {
                return $next($request); // Allow access if the role matches
            }
        }

        // Redirect or handle unauthorized access
        return redirect('/unauthorized'); // Adjust as needed
    }
}
