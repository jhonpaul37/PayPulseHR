<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanType extends Model
{
    use HasFactory;

    protected $table = 'loans_types';

    protected $fillable = ['loan_program_id', 'type', 'description'];

    public function programLoan()
    {
        return $this->belongsTo(ProgramLoan::class, 'loan_program_id');
    }

    public function loanPlans()
    {
        return $this->hasMany(LoanPlan::class);
    }

    public function loanProgram()
    {
        return $this->belongsTo(ProgramLoan::class, 'loan_program_id');
    }
}
