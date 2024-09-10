<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\voucher;
use App\Models\accounting_entry;
use App\Models\FundCluster;
use Inertia\Inertia;



class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $disVoucher = voucher::latest()->paginate(5);
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
    // Get latest ID to determine the next incrementing number
    $latestVoucher = Voucher::latest('id')->first();
    $incrementNumber = $latestVoucher ? str_pad($latestVoucher->id + 1, 5, '0', STR_PAD_LEFT) : '00001';

    // Generate the code using the format yearMonth-fundCluster-autoIncrement
    $code = now()->format('ym') . '-' . $request->f_cluster . '-' . $incrementNumber;

    // Validate the request fields, including uacs_code, debit, and credit as arrays
    $fields = $request->validate([
        'ors_burs_no' => ['required'],
        'f_cluster' => ['required'],
        'uacs_code' => ['required', 'array'],
        'debit' => ['required', 'array'],
        'credit' => ['required', 'array'],
        'user_id' => ['required'],
        'amount' => ['required'],
        'ApproveAmount' => ['required'],
        'particulars' => ['required'],
        'address' => ['required'],
        'payee' => ['required'],
        'tin_no' => ['required'],
        'bankName' => ['required'],
    ]);

    // Add the generated code and default div_num to the fields
    $fields['jev_no'] = $code;
    $fields['div_num'] = $fields['div_num'] ?? '0123';

    // Store uacs_code, debit, and credit as JSON-encoded arrays in the database
    $fields['uacs_code'] = json_encode($request->uacs_code);
    $fields['debit'] = json_encode($request->debit);
    $fields['credit'] = json_encode($request->credit);

    // Create a new voucher record
    Voucher::create($fields);

    // Redirect to the voucher page
    return redirect('/voucher');
}



    /**
     * Display the specified resource.
     */
    // public function show(voucher $voucher)
    // {
    //     return inertia('voucher/Show',['voucher' => $voucher]);
    // }
    public function show($id)
    {
        $voucher = Voucher::find($id);


        // Decode uacs_code if it's a JSON string
        $uacs_codes = is_string($voucher->uacs_code) ? json_decode($voucher->uacs_code, true) : $voucher->uacs_code;

        $voucher->uacs_code = array_map(function($code) {
            return accounting_entry::where('UACS_code', $code)->first(['UACS_code', 'Account_title']);
        }, $uacs_codes);

        return Inertia::render('voucher/Show', [
            'voucher' => $voucher,
        ]);
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
