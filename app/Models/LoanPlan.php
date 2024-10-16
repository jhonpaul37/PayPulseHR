<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanPlan extends Model
{
    use HasFactory;
    protected $table = 'loans_plans';
    protected $fillable = [
        'loan_type_id',
        'months',
        'interest_rate',
        'penalty_rate',
    ];

    public function loanType()
    {
        return $this->belongsTo(LoanType::class);
    }

}
