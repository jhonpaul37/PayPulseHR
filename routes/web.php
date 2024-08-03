<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});
Route::get('/disVoucher', function () {
    return inertia('Voucher');
});
