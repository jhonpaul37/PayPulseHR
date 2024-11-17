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
        'amount',
    ];

    // Relationship with EmployeeContribution
    public function employeeContributions()
    {
        return $this->hasMany(EmployeeContribution::class);
    }
}
