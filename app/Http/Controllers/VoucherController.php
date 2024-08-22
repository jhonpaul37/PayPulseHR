<?php

namespace App\Http\Controllers;

use App\Models\voucher;
use App\Models\accounting_entry;
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
    // public function uacsCodes(){

    //     $uacsCodes = accounting_entry::select('UACS_code', 'Account_title')->get();
    //     return Inertia('Create', [
    //     'uacsCodes' => $uacsCodes,
    // ]);
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $uacsCodes = accounting_entry::all();
        return inertia('voucher/Create',['uacsCodes'=>$uacsCodes]);
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request)
{
    $fields = $request->validate([
        'jev_no' => ['required'],
        'ors_burs_no' => ['required'],
        'f_cluster' => ['required'],
        'uacs_code' => ['required'],
        'user_id' => ['required']
    ]);

    // Set default value for div_num
    $fields['div_num'] = $fields['div_num'] ?? '0123'; // Replace 'default_value' with the desired default value

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
