<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FundClusterController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Routing
Route::middleware('auth')->group(function () {
    // Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/voucher',VoucherController::class);
});

// for the User Profit
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



Route::get('get-auto-increment', [VoucherController::class, 'getAutoIncrement']);

Route::get('/fClusters', [FundClusterController::class, 'fCluster']);


require __DIR__.'/auth.php';
