<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
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
    public function getAutoIncrement()
    {
        // Retrieve the last voucher ID
        $latestVoucher = Voucher::latest('id')->first();
        $incrementNumber = $latestVoucher ? str_pad($latestVoucher->id + 1, 5, '0', STR_PAD_LEFT) : '00001';

        return response()->json([
            'incrementNumber' => $incrementNumber
        ]);
    }
    public function store(Request $request)
    {
        // Get lastest ID to determine the next incrementing number
        $latestVoucher = Voucher::latest('id')->first();
        $incrementNumber = $latestVoucher ? str_pad($latestVoucher->id + 1, 5, '0', STR_PAD_LEFT) : '00001';

        // Generate the code using the Format yearMonth-fundCluster-autoIncrement
        $code = now()->format('ym') . '-' . $request->f_cluster . '-' . $incrementNumber;

        $fields = $request->validate([
            'ors_burs_no' => ['required'],
            'f_cluster' => ['required'],
            'uacs_code' => ['required', 'array'],
            'user_id' => ['required']
        ]);

        // Add the generated code and default div_num to the fields
        $fields['jev_no'] = $code;
        $fields['div_num'] = $fields['div_num'] ?? '0123';


        Voucher::create($fields);

        return redirect('/voucher');
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
