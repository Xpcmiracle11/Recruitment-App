<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
       protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'department',
    ];
}
