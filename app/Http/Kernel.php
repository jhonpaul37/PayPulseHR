<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Global HTTP middleware stack.
     */
    protected $middleware = [
    ];

    /**
     * Web and API middleware groups.
     */
    protected $middlewareGroups = [
        'web' => [
        ],

        'api' => [
        ],
    ];

    /**
     * Individual route middleware.
     */
    protected $routeMiddleware = [
        'role' => \App\Http\Middleware\RoleMiddleware::class,
    ];
}
