<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Benefit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function employeeBenefits()
    {
        return $this->hasMany(EmployeeBenefit::class);
    }
}
