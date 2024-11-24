<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeContribution extends Model
{
    use HasFactory;
    protected $table = 'employee_contribution';

    protected $fillable = [
        'employee_id',
        'contribution_id',
        'amount',
    ];

    // Relationships
    public function contribution()
    {
        return $this->belongsTo(Contribution::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

}
