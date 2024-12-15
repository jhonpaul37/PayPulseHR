<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FundCluster;
use Dotenv\Store\File\Reader;
use Exception;

class FundClusterController extends Controller
{

    public function uploadCsv(Request $request)
    {
        // Validate the file
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        try {
            // Load the CSV file
            $csv = Reader::createFromPath($request->file('csv_file')->getRealPath(), 'r');
            $csv->setHeaderOffset(0); // Set the header row index

            // Iterate through each row and update/insert into the database
            foreach ($csv as $row) {
                FundCluster::updateOrCreate(
                    ['cluster_code' => $row['cluster_code']], // Match by cluster_code
                    [
                        'amount' => $row['amount'],
                    ]
                );
            }

            return redirect()->back()->with('success', 'Fund Clusters updated successfully.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to process the CSV file: ' . $e->getMessage());
        }
    }

    public function fCluster()
        {
            $fundClusters = FundCluster::all();
            return response()->json($fundClusters);
        }
}
