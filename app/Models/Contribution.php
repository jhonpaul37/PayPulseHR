<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    // Relationship with EmployeeContribution
    public function employeeContributions()
    {
        return $this->hasMany(EmployeeContribution::class);
    }

    public function employee()
    {
        return $this->belongsToMany(Employee::class, 'employee_contribution')
                    ->withPivot('amount')
                    ->withTimestamps();
    }

}
