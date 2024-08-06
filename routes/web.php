<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VoucherController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::resource('voucher',VoucherController::class);
