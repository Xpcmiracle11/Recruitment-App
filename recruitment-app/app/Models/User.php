<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'region',
        'province',
        'municipality',
        'barangay',
        'street',
        'zip',
        'phone_number',
        'email',
        'gender',
        'dob',
        'age',
        'educational_attainment',
        'institution_name',
        'course',
        'start_date',
        'end_date',
        'gpa',
        'source',
        'other_source',
        'sourcer',
        'other_sourcer',
        'previous_employee',
        'recruiter',    
        'bpo_experience',
        'application_method',
        'resume',
        'skillset',
    ];
}
