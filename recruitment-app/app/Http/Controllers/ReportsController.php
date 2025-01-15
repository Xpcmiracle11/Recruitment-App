<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Application;

class ReportsController extends Controller
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

        $months = DB::table('users')
            ->selectRaw('MONTH(created_at) as month')
            ->distinct()
            ->orderBy('month', 'asc')
            ->pluck('month')
            ->merge([now()->month]) 
            ->unique() 
            ->sort() 
            ->map(function ($month) {
                return [
                    'value' => $month,
                    'label' => date('F', mktime(0, 0, 0, $month, 10)),
                ];
            });


        $admin = Auth::user();

        $selectedMonth = $request->input('month', date('m')); 
        $selectedYear = $request->input('year', date('Y')); 

        $experience = User::selectRaw('bpo_experience, COUNT(*) as applicants')
            ->whereYear('created_at', $selectedYear)
            ->whereMonth('created_at', $selectedMonth)
            ->groupBy('bpo_experience')
            ->orderBy('bpo_experience') 
            ->get();
        
        $applicationMethod = User::selectRaw('application_method, COUNT(*) as applicants')
            ->whereYear('created_at', $selectedYear)
            ->whereMonth('created_at', $selectedMonth)
            ->whereIn('application_method', ['Walk-in', 'Online'])
            ->groupBy('application_method')
            ->get();

        $predefinedSources = ['Facebook', 'Referral', 'Walk-in', 'Jobstreet', 'Job Fair', 'Other'];

        $source = User::selectRaw('source, COUNT(*) as applicants')
        ->whereYear('created_at', $selectedYear)
        ->whereMonth('created_at', $selectedMonth)
        ->whereIn('source', $predefinedSources)
        ->groupBy('source')
        ->get();

        $source = collect($predefinedSources)->map(function ($label) use ($source) {
            $data = $source->firstWhere('source', $label);
            return [
                'source' => $label,
                'applicants' => $data ? $data->applicants : 0,
            ];
        });

        $ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'];

        $ageDistribution = User::selectRaw("
                CASE
                    WHEN age BETWEEN 18 AND 25 THEN '18-25'
                    WHEN age BETWEEN 26 AND 35 THEN '26-35'
                    WHEN age BETWEEN 36 AND 45 THEN '36-45'
                    WHEN age BETWEEN 46 AND 55 THEN '46-55'
                    ELSE '56+'
                END as age_group,
                COUNT(*) as applicants
            ")
            ->whereYear('created_at', $selectedYear)
            ->whereMonth('created_at', $selectedMonth)
            ->groupBy('age_group')
            ->get()
            ->keyBy('age_group');

        $ageDistribution = collect($ageGroups)->map(function ($group) use ($ageDistribution) {
            return [
                'age_group' => $group,
                'applicants' => $ageDistribution->get($group)->applicants ?? 0,
            ];
        });



        $status = Application::selectRaw('status, COUNT(*) as applicants')
        ->whereYear('created_at', $selectedYear)
        ->whereMonth('created_at', $selectedMonth)
        ->whereIn('status', ['Pending', 'Passed', 'Failed'])
        ->groupBy('status')
        ->get();

        return Inertia::render('Reports/Reports', [
            'admin' => $admin,
            'years' => $years,
            'months' => $months,
            'selectedYear' => $selectedYear, 
            'selectedMonth' => $selectedMonth, 
            'experienceData' => $experience,
            'applicationMethodData' => $applicationMethod,
            'source' => $source,
            'ageDistribution' => $ageDistribution,
            'status' => $status, 

        ]);
    }
}
