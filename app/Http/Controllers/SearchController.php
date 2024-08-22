<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\accounting_entry;

class SearchController extends Controller
{
    public function searchUacs(Request $request)
    {
        $search = $request->input('search');
        $results = accounting_entry::where('account_title', 'LIKE', "%{$search}%")
                            ->get(['account_title', 'uacs_code']);

        return response()->json($results);
    }
}
