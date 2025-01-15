<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Application;

class AnalyticsController extends Controller
{   
    public function index(Request $request)
    {
        $years = DB::table('users')
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->merge([now()->year]) 
            ->unique(); 
            
        $selectedYear = $request->input('year', date('Y')); 

        $totalApplicants = Application::whereYear('created_at', $selectedYear)->count();

        $totalPendingApplicants = Application::whereYear('created_at', $selectedYear)
            ->where('status', 'Pending')
            ->count();

        $totalPassedApplicants = Application::whereYear('created_at', $selectedYear)
            ->where('status', 'Passed')
            ->count();

        $totalFailedApplicants = Application::whereYear('created_at', $selectedYear)
        ->where('status', 'Failed')
        ->count();

        $applicantsProgression = [
        'currentYear' => Application::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $selectedYear)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month'),

        'previousYear' => Application::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $selectedYear - 1)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month'),
        ];

        $ageSuccessRate = Application::join('users', 'application_status.user_id', '=', 'users.id')
        ->selectRaw("
            CASE 
                WHEN users.age BETWEEN 18 AND 25 THEN '18-25'
                WHEN users.age BETWEEN 26 AND 35 THEN '26-35'
                WHEN users.age BETWEEN 36 AND 45 THEN '36-45'
                WHEN users.age BETWEEN 46 AND 55 THEN '46-55'
                ELSE '56+'
            END as age_group,
            COUNT(CASE WHEN application_status.status = 'Passed' THEN 1 END) as passed,
            COUNT(CASE WHEN application_status.status = 'Failed' THEN 1 END) as failed
        ")
        ->whereYear('application_status.created_at', $selectedYear)
        ->groupBy('age_group')
        ->orderByRaw("
            FIELD(age_group, '18-25', '26-35', '36-45', '46-55', '56+')
        ")
        ->get();

        $applicantsStatusProgression = [
        'Pending' => [
            'currentYear' => Application::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', $selectedYear)
                ->where('status', 'Pending')
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('count', 'month'),
        ],
        'Failed' => [
            'currentYear' => Application::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', $selectedYear)
                ->where('status', 'Failed')
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('count', 'month'),
        ],
        'Passed' => [
            'currentYear' => Application::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', $selectedYear)
                ->where('status', 'Passed')
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('count', 'month'),
        ],
    ];
        
        $statusCount = [
            'Pending' => Application::whereYear('created_at', $selectedYear)
                ->where('status', 'Pending')
                ->count(),

            'Failed' => Application::whereYear('created_at', $selectedYear)
                ->where('status', 'Failed')
                ->count(),

            'Passed' => Application::whereYear('created_at', $selectedYear)
                ->where('status', 'Passed')
                ->count(),
        ];

        $admin = Auth::user();

        return Inertia::render('Analytics/Analytics', [
            'admin' => $admin,
            'years' => $years,
            'total_applicants' => $totalApplicants,
            'pending_applicants' => $totalPendingApplicants,
            'passed_applicants' => $totalPassedApplicants,
            'failed_applicants' => $totalFailedApplicants,
            'applicants_progression' => $applicantsProgression,
            'age_success' => $ageSuccessRate,
            'applicants_status_progression' => $applicantsStatusProgression,
            'status_count' => $statusCount
        ]);
    }
}
