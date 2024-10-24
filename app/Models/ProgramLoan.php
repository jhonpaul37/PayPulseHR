<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramLoan extends Model
{
    use HasFactory;

    protected $table = 'programs_loans';

    protected $fillable = ['name'];

    public function loanTypes()
    {
        return $this->hasMany(LoanType::class);
    }
}
