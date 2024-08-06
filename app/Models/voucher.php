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
        'uacs_code',
        'user_id',

    ];
}
