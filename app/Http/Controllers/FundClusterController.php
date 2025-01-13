<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FundCluster;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Exception;

class FundClusterController extends Controller
{

public function uploadCSV(Request $request)
{
    $request->validate([
        'csv_file' => 'required|mimes:csv,txt|max:2048',
    ]);

    // Open and parse the CSV file
    if ($file = $request->file('csv_file')) {
        $data = array_map('str_getcsv', file($file->getRealPath()));

        // Skip the header row
        $header = array_shift($data);

        foreach ($data as $row) {
            // Ensure the cluster_code matches the format in the database (with leading zeros)
            $clusterCode = str_pad($row[0], 2, '0', STR_PAD_LEFT);  // Pad to two digits
            $amountToAdd = (float) $row[1];

            // Find the fund cluster by cluster_code
            $fundCluster = FundCluster::where('cluster_code', $clusterCode)->first();

            if ($fundCluster) {
                // Add the amount to the current balance
                $fundCluster->amount += $amountToAdd;
                $fundCluster->save();
            }
        }

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Fund clusters updated successfully!');
    }

    // Redirect back with an error message
    return redirect()->back()->with('error', 'Failed to process the file.');
}


    public function fCluster()
        {
            $fundClusters = FundCluster::all();
            return response()->json($fundClusters);
        }
}
