<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FundCluster;

class FundClusterController extends Controller
{
    public function fCluster()
        {
            $fundClusters = FundCluster::all();
            return response()->json($fundClusters);
        }
}
