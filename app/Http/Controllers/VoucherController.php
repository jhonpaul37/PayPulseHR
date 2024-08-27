<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\voucher;
use App\Models\accounting_entry;
use App\Models\FundCluster;


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
        $uacsCodes = accounting_entry::all();
        $fundClusters = FundCluster::all();
        return inertia('voucher/Create',['uacsCodes'=>$uacsCodes, 'fundClusters' => $fundClusters,]);
    }

    // Helper method to generate JEV No.

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
            $lastVoucher = Voucher::orderBy('id', 'desc')->first();
    $incrementNumber = $lastVoucher ? $lastVoucher->incrementing_number + 1 : 1;
    $formattedNumber = str_pad($incrementNumber, 5, '0', STR_PAD_LEFT);

    $code = now()->format('ym') . '-' . $request->f_cluster . '-' . $formattedNumber;

        $fields = $request->validate([
            'jev_no' => $code,
            'ors_burs_no' => ['required'],
            'f_cluster' => ['required'],
            'uacs_code' => ['required', 'array'],
            'user_id' => ['required']
        ]);

        // Set default value for div_num if not provided
        $fields['div_num'] = $fields['div_num'] ?? '0123';


        Voucher::create($fields);

        return redirect('/voucher');

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
