<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FundCluster;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // return Inertia::render('Dashboard');
        $fundClusters = FundCluster::all();
        $chartData = [
            'labels' => ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            'data' => [65],
        ];

        return Inertia::render('Dashboard', [
            'chartData' => $chartData,'fundClusters' => $fundClusters
        ]);
    }
}
