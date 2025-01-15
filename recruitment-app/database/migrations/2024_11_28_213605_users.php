<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
     Schema::create('users', function (Blueprint $table){
        $table->id();
        $table->string('first_name');
        $table->string('middle_name')->nullable();
        $table->string('last_name');
        $table->string('suffix');
        $table->string('region');
        $table->string('province');
        $table->string('municipality');
        $table->string('barangay');
        $table->string('street')->nullable();
        $table->string('zip');
        $table->string('phone_number');
        $table->string('email');
        $table->string('gender');
        $table->string('dob');
        $table->string('age')->nullable();
        $table->string('educational_attainment');
        $table->string('institution_name');
        $table->string('course');
        $table->string('start_date');
        $table->string('end_date');
        $table->string('gpa');
        $table->string('source');
        $table->string('other_source')->nullable();
        $table->string('sourcer');
        $table->string('other_sourcer')->nullable();
        $table->string('previous_employee');
        $table->string('recruiter');
        $table->string('bpo_experience');
        $table->string('application_method');
        $table->string('resume')->nullable();
        $table->string('skillset');
        $table->timestamps();
     });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
