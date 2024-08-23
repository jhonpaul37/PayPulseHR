<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'jev_no',
        'ors_burs_no',
        'f_cluster',
        'div_num',
        'uacs_code', // Ensure this is included
        'user_id',
    ];

    // Optionally, specify casting for the JSON column
    protected $casts = [
        'uacs_code' => 'array', // Cast uacs_code to array
    ];
        public function accounting_entry()
    {
        return $this->hasMany(accounting_entry::class);
    }
    public function fund_cluster(){
        return $this->hasMany(FundCluster::class);
    }
}
