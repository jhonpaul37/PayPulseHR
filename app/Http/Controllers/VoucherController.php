<?php

namespace App\Http\Controllers;

use App\Models\voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $disVoucher = voucher::latest()->paginate(3);
        return inertia('Voucher',['vouchers' => $disVoucher]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('voucher/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // sleep(1);

        $fields = $request->validate([
            'f_cluster' => ['required'],
            'jev_no' => ['required']
        ]);

        Voucher::create($fields);

        return redirect ('/voucher');

        // tests output
        // dd($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(voucher $voucher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(voucher $voucher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, voucher $voucher)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(voucher $voucher)
    {
        //
    }
}
