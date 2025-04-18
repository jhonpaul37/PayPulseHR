<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FundCluster extends Model
{
    use HasFactory;
    protected $table = 'fund_cluster';

    protected $fillable = ['cluster_code', 'amount'];
}
