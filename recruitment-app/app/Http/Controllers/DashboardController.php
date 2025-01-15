<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Exports\ApplicantsExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\PDF;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'Default');

        $years = User::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');

       $months = User::selectRaw('MONTH(created_at) as month')
            ->distinct()
            ->orderBy('month', 'asc')
            ->pluck('month')
            ->map(function ($month) {
                return date('F', mktime(0, 0, 0, $month, 10));
            });

        $applicants = User::select(
                'users.id',
                'users.first_name',
                'users.middle_name',
                'users.last_name',
                'users.suffix',
                'users.region',
                'users.province',
                'users.municipality',
                'users.barangay',
                'users.street',
                'users.zip',
                'users.phone_number',
                'users.email',
                'users.gender',
                'users.dob',
                'users.age',
                'users.educational_attainment',
                'users.institution_name',
                'users.course',
                'users.start_date',
                'users.end_date',
                'users.gpa',
                'users.source',
                'users.other_source',
                'users.sourcer',
                'users.other_sourcer',
                'users.previous_employee',
                'users.recruiter',
                'users.bpo_experience',
                'users.application_method',
                'users.resume',
                'users.skillset',
                DB::raw("DATE_FORMAT(users.created_at, '%m-%d-%Y') as date"),
                'application_status.id as application_status_id',
                'application_status.status',
                'application_status.first_call',
                'application_status.second_call',
                'application_status.third_call',
                'application_status.communication',
                'application_status.reading',
                'application_status.typing',
                'application_status.problem_solving',
                'application_status.work_ethics',
                'application_status.budget_issues',
                'application_status.remarks'
            )
            ->join('application_status', 'users.id', '=', 'application_status.user_id')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.first_name', 'like', "%{$search}%")
                    ->orWhere('users.middle_name', 'like', "%{$search}%")
                    ->orWhere('users.last_name', 'like', "%{$search}%")
                    ->orWhere('application_status.status', 'like', "%{$search}%");
                });
            })
            ->when($sort !== 'Default', function ($query) use ($sort) {
                if ($sort === 'Pending') {
                    $query->where('application_status.status', 'Pending')
                        ->whereNull('application_status.first_call')
                        ->whereNull('application_status.second_call')
                        ->whereNull('application_status.third_call');
                } elseif ($sort === 'Passed') {
                    $query->where('application_status.status', 'Passed');
                } elseif ($sort === 'Failed') {
                    $query->where('application_status.status', 'Failed');
                } elseif ($sort === 'Answered') {
                    $query->where('application_status.status', 'Pending')
                        ->where(function ($q) {
                            $q->where('application_status.third_call', 'Answered')
                                ->orWhere('application_status.second_call', 'Answered')
                                ->orWhere('application_status.first_call', 'Answered');
                        });
                } elseif ($sort === 'No Answer') {
                    $query->where('application_status.status', 'Pending')
                        ->where(function ($q) {
                            $q->where('application_status.third_call', 'No Answer')
                                ->orWhere('application_status.second_call', 'No Answer')
                                ->orWhere('application_status.first_call', 'No Answer');
                        });
                }
            })
            ->orderByRaw("CASE 
                            WHEN application_status.status = 'Pending' AND application_status.first_call IS NULL
                                AND application_status.second_call IS NULL AND application_status.third_call IS NULL THEN 1
                            WHEN application_status.status = 'Pending' THEN 2
                            WHEN application_status.third_call = 'No Answer' THEN 3
                            WHEN application_status.third_call = 'Answered' THEN 4
                            WHEN application_status.second_call = 'No Answer' THEN 5
                            WHEN application_status.second_call = 'Answered' THEN 6
                            WHEN application_status.first_call = 'No Answer' THEN 7
                            WHEN application_status.first_call = 'Answered' THEN 8
                            WHEN application_status.status = 'Passed' THEN 9
                            WHEN application_status.status = 'Failed' THEN 10
                            ELSE 11
                        END")
            ->orderBy('users.created_at', 'desc')
            ->paginate(10);

        $admin = Auth::user();

        return Inertia::render('Dashboard/Dashboard', [
            'applicants' => $applicants,
            'search' => $search,
            'sort' => $sort,
            'years' => $years, 
            'months' => $months,  
            'admin' => $admin,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'firstCall' => 'nullable|string|in:Answered,No Answer',
                'secondCall' => 'nullable|string|in:Answered,No Answer',
                'thirdCall' => 'nullable|string|in:Answered,No Answer',
                'communication' => 'nullable|string',
                'reading' => 'nullable|string',
                'typing' => 'nullable|string',
                'problemSolving' => 'nullable|string',
                'workEthics' => 'nullable|string',
                'budgetIssues' => 'nullable|string',
                'status' => 'nullable|string',
                'remarks' => 'nullable|string|max:500',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        $application = Application::findOrFail($id);

        if (isset($validatedData['thirdCall']) && $validatedData['thirdCall'] === 'No Answer') {
            $validatedData['status'] = 'Failed';
        }

        $application->update([
            'first_call' => $validatedData['firstCall'] ?? null,
            'second_call' => $validatedData['secondCall'] ?? null,
            'third_call' => $validatedData['thirdCall'] ?? null,
            'communication' => $validatedData['communication'] ?? null,
            'reading' => $validatedData['reading'] ?? null,
            'typing' => $validatedData['typing'] ?? null,
            'problem_solving' => $validatedData['problemSolving'] ?? null,
            'work_ethics' => $validatedData['workEthics'] ?? null,
            'budget_issues' => $validatedData['budgetIssues'] ?? null,
            'status' => $validatedData['status'] ?? null,
            'remarks' => $validatedData['remarks'] ?? null,
        ]);

        return redirect()->route('dashboard.index')->with('message', 'Application status updated successfully!');
    }

    public function updatePersonalInfo(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'first_name' => 'nullable|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'suffix' => 'nullable|string|max:50',
                'region' => 'nullable|string|max:255',
                'province' => 'nullable|string|max:255',
                'municipality' => 'nullable|string|max:255',
                'barangay' => 'nullable|string|max:255',
                'street' => 'nullable|string|max:255',
                'zip' => 'nullable|string|max:50',
                'phone_number' => 'nullable|string|max:15',
                'email' => 'nullable|email|max:255',
                'gender' => 'nullable|string|max:10',
                'dob' => 'nullable|date',
                'age' => 'nullable|integer',
                'educational_attainment' => 'nullable|string|max:255',
                'institution_name' => 'nullable|string|max:255',
                'course' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'gpa' => 'nullable|numeric',
                'source' => 'nullable|string|max:255',
                'other_source' => 'nullable|string|max:255',
                'sourcer' => 'nullable|string|max:255',
                'other_sourcer' => 'nullable|string|max:255',
                'previous_employee' => 'nullable|string|max:255',
                'recruiter' => 'nullable|string|max:255',
                'bpo_experience' => 'nullable|string|max:255',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        $application = User::findOrFail($id);

        $application->update([
            'first_name' => $validatedData['first_name'] ?? $application->first_name,
            'middle_name' => $validatedData['middle_name'] ?? $application->middle_name,
            'last_name' => $validatedData['last_name'] ?? $application->last_name,
            'suffix' => $validatedData['suffix'] ?? $application->suffix,
            'region' => $validatedData['region'] ?? $application->region,
            'province' => $validatedData['province'] ?? $application->province,
            'municipality' => $validatedData['municipality'] ?? $application->municipality,
            'barangay' => $validatedData['barangay'] ?? $application->barangay,
            'street' => $validatedData['street'] ?? $application->street,
            'zip' => $validatedData['zip'] ?? $application->zip,
            'phone_number' => $validatedData['phone_number'] ?? $application->phone_number,
            'email' => $validatedData['email'] ?? $application->email,
            'gender' => $validatedData['gender'] ?? $application->gender,
            'dob' => $validatedData['dob'] ?? $application->dob,
            'age' => $validatedData['age'] ?? $application->age,
            'educational_attainment' => $validatedData['educational_attainment'] ?? $application->educational_attainment,
            'institution_name' => $validatedData['institution_name'] ?? $application->institution_name,
            'course' => $validatedData['course'] ?? $application->course,
            'start_date' => $validatedData['start_date'] ?? $application->start_date,
            'end_date' => $validatedData['end_date'] ?? $application->end_date,
            'gpa' => $validatedData['gpa'] ?? $application->gpa,
            'source' => $validatedData['source'] ?? $application->source,
            'other_source' => $validatedData['other_source'] ?? $application->other_source,
            'sourcer' => $validatedData['sourcer'] ?? $application->sourcer,
            'other_sourcer' => $validatedData['other_sourcer'] ?? $application->other_sourcer,
            'previous_employee' => $validatedData['previous_employee'] ?? $application->previous_employee,
            'recruiter' => $validatedData['recruiter'] ?? $application->recruiter,
            'bpo_experience' => $validatedData['bpo_experience'] ?? $application->bpo_experience,
        ]);

        return redirect()->route('dashboard.index')->with('message', 'Personal information updated successfully!');
    }


    public function exportApplicants(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $status = $request->input('status');

        $count = User::join('application_status', 'users.id', '=', 'application_status.user_id')
            ->whereYear('users.created_at', $year)
            ->whereMonth('users.created_at', $month)
            ->where('application_status.status', $status === 'All' ? 'like' : '=', $status)
            ->count();

        Log::info("Export prepared: year=$year, month=$month, status=$status. Total users: $count");

        return response()->json(['message' => 'Export prepared successfully']);
    }

    public function downloadExport(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $status = $request->input('status');

        Log::info("Downloading export: year=$year, month=$month, status=$status");
        
        return Excel::download(
            new ApplicantsExport($year, $month, $status),
            'applicants_export.xlsx'
        );
    }

    public function downloadPDF(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $status = $request->input('status');

        $applicants = User::join('application_status', 'users.id', '=', 'application_status.user_id')
        ->select(
            'users.id',
            'users.first_name',
            'users.middle_name',
            'users.last_name',
            'users.suffix',
            'users.region',
            'users.province',
            'users.municipality',
            'users.barangay',
            'users.street',
            'users.zip',
            'users.phone_number',
            'users.email',
            'users.gender',
            'users.dob',
            'users.age',
            'users.educational_attainment',
            'users.institution_name',
            'users.course',
            'users.start_date',
            'users.end_date',
            'users.gpa',
            'users.source',
            'users.other_source',
            'users.sourcer',
            'users.other_sourcer',
            'users.previous_employee',
            'users.recruiter',
            'users.bpo_experience',
            'users.application_method',
            'users.resume',
            'users.skillset',
            'users.created_at',
            'application_status.id as application_status_id',
            'application_status.status',
            'application_status.first_call',
            'application_status.second_call',
            'application_status.third_call',
            'application_status.communication',
            'application_status.reading',
            'application_status.typing',
            'application_status.problem_solving',
            'application_status.work_ethics',
            'application_status.budget_issues',
            'application_status.remarks'
        )
        ->get();

        if ($applicants->isEmpty()) {
            return response()->json(['message' => 'No data found for the given filters'], 404);
        }

        $pdf = Pdf::loadView('pdf.applicants', [
            'applicants' => $applicants,
            'year' => $year,
            'month' => $month,
            'status' => $status,
        ]);

        return $pdf->download('applicants_report.pdf');
    }

    public function destroy($id)
    {
        $applicant = User::findOrFail($id);
        $applicant->delete();

        return redirect()->route('dashboard.index')->with('message', 'Applicant deleted successfully.');
    }
}
