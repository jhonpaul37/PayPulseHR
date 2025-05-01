<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LwopRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'minutes',
        'hours',
        'days',
        'amount',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
