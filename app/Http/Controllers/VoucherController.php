<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\voucher;
use App\Models\accounting_entry;
use App\Models\FundCluster;
use App\Models\Employee;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;




class VoucherController extends Controller
{
    public function index()
    {
        $disVoucher = voucher::latest()->paginate(5);
        return inertia('voucher/Voucher',['vouchers' => $disVoucher]);
    }

public function create()
{
    $uacsCodes = accounting_entry::all();
    // dd($uacsCodes = accounting_entry::all());
    $fundClusters = FundCluster::all();
    $user = Auth::user();

    $employee = Employee::where('user_id', $user->id)->first();

    $filEmployees = Employee::whereIn('classification', ['Regular', 'Casual'])->get();

    return inertia('voucher/Create',[
    'uacsCodes'=>$uacsCodes,
    'fundClusters' => $fundClusters,
    'employee' => $employee,
    'filEmployees' => $filEmployees,
    'auth' => $user,
]);
}
    public function getAutoIncrement()
    {
        // Retrieve last voucher ID
        $latestVoucher = Voucher::latest('id')->first();
        $incrementNumber = $latestVoucher ? str_pad($latestVoucher->id + 1, 5, '0', STR_PAD_LEFT) : '00001';

        return response()->json([
            'incrementNumber' => $incrementNumber
        ]);
    }

public function store(Request $request)
{
    // Get the authenticated user
    $user = Auth::user();

    // Get the latest ID for generating the code
    $latestVoucher = Voucher::latest('id')->first();
    $incrementNumber = $latestVoucher ? str_pad($latestVoucher->id + 1, 5, '0', STR_PAD_LEFT) : '00001';

    // Generate the code in the format (yearMonth-fundCluster-autoIncrement)
    $code = now()->format('ym') . '-' . $request->f_cluster . '-' . $incrementNumber;

    // Validate the incoming request
    $fields = $request->validate([
        'ors_burs_no' => ['required', 'string'],
        'f_cluster' => ['required', 'string'],
        'uacs_code' => ['required', 'array'],
        'debit' => ['required', 'array'],
        'credit' => ['required', 'array'],
        'user_id' => ['required', 'integer'],
        'amount' => ['required', 'numeric'],
        'ApproveAmount' => ['required', 'numeric'],
        'particulars' => ['required', 'string'],
        'address' => ['required', 'string'],
        'payee' => ['required', 'string'],
        'tin_no' => ['required', 'string'],
        'bankName' => ['required', 'string'],

        'approved_by' => ['required', 'integer'],
        'signatory_1' => ['required', 'integer'],
        'signatory_2' => ['required', 'integer'],
        'responsibility_center' => ['nullable', 'string'],
        'mfo_pap' => ['nullable', 'string'],
        'paymentMode' => ['nullable', 'string'],
    ]);

    // Add the generated code and default div_num to the fields
    $fields['jev_no'] = $code;
    $fields['div_num'] = $fields['div_num'] ?? '0123';

    // Set the currently logged-in user's employee ID as `prepared_by`
    $employee = Employee::where('user_id', $user->id)->first();
    if (!$employee) {
        return redirect()->back()->withErrors(['prepared_by' => 'Employee details not found for the logged-in user.']);
    }
    $fields['prepared_by'] = $employee->id;

    // Handle mode of payment for "Others"
    if ($request->paymentMode === 'Others') {
        $fields['paymentMode'] = $request->otherPaymentMode;
    }

    // Convert arrays to JSON for storage
    $fields['uacs_code'] = json_encode($fields['uacs_code']);
    $fields['debit'] = json_encode($fields['debit']);
    $fields['credit'] = json_encode($fields['credit']);

    // Create the voucher in the database
    Voucher::create($fields);

    // Redirect to the voucher listing page with a success message
    return redirect('/voucher')->with('success', 'Voucher created successfully!');
}


    public function show($id)
    {
        $voucher = Voucher::find($id);


        // Decode uacs_code JSON
        $uacs_codes = is_string($voucher->uacs_code) ? json_decode($voucher->uacs_code, true) : $voucher->uacs_code;

        $voucher->uacs_code = array_map(function($code) {
            return accounting_entry::where('UACS_code', $code)->first(['UACS_code', 'Account_title']);
        }, $uacs_codes);

        return Inertia::render('voucher/Show', [
            'voucher' => $voucher,
        ]);
    }

    public function fCluster()
    {
        $fundClusters = FundCluster::all();
        return response()->json($fundClusters);
    }

}
