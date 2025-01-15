<?php
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ModeratorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use Inertia\Inertia;

Route::inertia('/signup', 'Signup')->name('signup');
Route::get('/signup', [UserController::class, 'index'])->name('dashboard.index');
Route::post('/signup', [UserController::class, 'store'])->name('signup.store');

Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::post('/login', [LoginController::class, 'login'])->name('login.attempt');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::put('/dashboard/application/{id}/status', [DashboardController::class, 'updateStatus'])->name('dashboard.update.status');
    Route::put('/dashboard/application/{id}/personal-info', [DashboardController::class, 'updatePersonalInfo'])->name('dashboard.update.personal_info');
    Route::post('/dashboard/export', [DashboardController::class, 'exportApplicants'])->name('dashboard.export');
    Route::get('/dashboard/export/downloadExcel', [DashboardController::class, 'downloadExport'])->name('dashboard.export.download');
    Route::get('/dashboard/export/downloadPDF', [DashboardController::class, 'downloadPDF'])->name('dashboard.export.downloadPDF');
    Route::delete('/dashboard/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');

});
Route::middleware(['auth'])->group(function () {
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/moderator', [ModeratorController::class, 'index'])->name('moderator.index');
    Route::post('/moderator', [ModeratorController::class, 'store'])->name('moderator.store');
    Route::put('/moderator/{id}', [ModeratorController::class, 'update'])->name('moderator.update');
    Route::delete('/moderator/{id}', [ModeratorController::class, 'destroy'])->name('moderator.destroy');

});
