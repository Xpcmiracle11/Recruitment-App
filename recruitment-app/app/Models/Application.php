<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $table = 'application_status';

    protected $fillable = [
        'id',
        'status',
        'user_id',
        'first_call',
        'second_call',
        'third_call',
        'communication',
        'remarks',
        'reading',
        'typing',
        'problem_solving',
        'work_ethics',
        'budget_issues',
        'created_at'
    ];
}
