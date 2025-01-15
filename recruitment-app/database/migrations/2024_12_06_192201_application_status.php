<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('application_status', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); 
            $table->string('status')->default('Pending');
            $table->string('first_call')->nullable();
            $table->string('second_call')->nullable();
            $table->string('third_call')->nullable();
            $table->string('communication')->nullable();
            $table->string('reading')->nullable();
            $table->string('typing')->nullable();
            $table->string('problem_solving')->nullable();
            $table->string('work_ethics')->nullable();
            $table->string('budget_issues')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps(); 
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_status');
    }
};
