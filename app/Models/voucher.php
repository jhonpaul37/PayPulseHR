<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'ors_burs_no',
        'f_cluster',
        'uacs_code',
        'debit',
        'credit',
        'user_id',
        'amount',
        'ApproveAmount',
        'particulars',
        'address',
        'payee',
        'tin_no',
        'jev_no',
        'div_num',
        'bankName',

        'responsibility_center',
        'mfo_pap',
        'mode_of_payment',
        'approved_by',
        'prepared_by',
        'signatory_1',
        'signatory_2',
        'signatory_3',
    ];

    protected $casts = [
        'uacs_code' => 'array',
        'debit' => 'array',
        'credit' => 'array',
    ];
    public function accounting_entry()
    {
        return $this->hasMany(accounting_entry::class);
    }
    public function fund_cluster(){
        return $this->hasMany(FundCluster::class);
    }
    public function employee()
    {
        return $this->hasOne(Employee::class, 'user_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function signatory($field)
    {
        return $this->belongsTo(Employee::class, $field);
    }


}
