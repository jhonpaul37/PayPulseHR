<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cookie\CookieJar;

class EncryptCookies
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->headers->setCookie(CookieJar::getDefaultCookie());

        return $response;
    }
}
