<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FundClusterController;
use App\Http\Controllers\VoucherController;

use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Home'); // Adjust to your actual Inertia page component
});


Route::resource('voucher',VoucherController::class);

Route::get('/login', function () {
    return Inertia::render('Login'); // Adjust to your actual Inertia page component
})->middleware('guest');

Route::get('/register', function () {
    return Inertia::render('Register'); // Adjust to your actual Inertia page component
})->middleware('guest');


// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [UserController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('voucher', VoucherController::class);
    Route::get('get-auto-increment', [VoucherController::class, 'getAutoIncrement']);
    Route::get('/fClusters', [FundClusterController::class, 'fCluster']);
});

// If you want a separate route for dashboard, you can keep this or adjust as needed
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); // Adjust to your actual Inertia page component
})->middleware(['auth', 'verified'])->name('dashboard');

// Include authentication routes
require __DIR__.'/auth.php';




// use App\Http\Controllers\ProfileController;
// use Illuminate\Foundation\Application;
// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';

// use App\Http\Controllers\FundClusterController;
// use App\Http\Controllers\VoucherController;
// use App\Http\Controllers\UserController;
// use Inertia\Inertia;

// use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return inertia('Home');
// });


// Route::get('/login', function () {
//     return Inertia::render('Login');
// })->middleware('guest');

// Route::get('/register', function () {
//     return Inertia::render('Register');
// })->middleware('guest');


// Route::middleware('auth')->group(function () {
//     Route::get('/dashboard', [UserController::class, 'index'])->name('dashboard');
// });

// Route::resource('voucher',VoucherController::class);
// Route::get('get-auto-increment', [VoucherController::class, 'getAutoIncrement']);

// Route::get('/fClusters', [FundClusterController::class, 'fCluster']);

// Route::get('/dashboard', function () {
//     return inertia('Dashboard');
// });
