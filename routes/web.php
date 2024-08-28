<?php

use App\Http\Controllers\FundClusterController;
use App\Http\Controllers\VoucherController;

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

// Route::get('/user-data', [UserController::class, 'userData']);

Route::resource('voucher',VoucherController::class);
Route::get('get-auto-increment', [VoucherController::class, 'getAutoIncrement']);

Route::get('/fClusters', [FundClusterController::class, 'fCluster']);

Route::get('/dashboard', function () {
    return inertia('Dashboard');
});
