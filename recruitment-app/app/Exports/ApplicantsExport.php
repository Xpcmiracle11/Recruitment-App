<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ApplicantsExport implements FromCollection, WithHeadings
{
    protected $year;
    protected $month;
    protected $status;

    public function __construct($year, $month, $status)
    {
        $this->year = $year;
        $this->month = $month;
        $this->status = $status;
    }

    public function collection()
    {
        $monthNumber = date('m', strtotime($this->month));

        $query = User::join('application_status', 'users.id', '=', 'application_status.user_id')
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
            ->whereYear('users.created_at', $this->year)
            ->whereMonth('users.created_at', $monthNumber);

        if ($this->status !== 'All') {
            $query->where('application_status.status', $this->status);
        }

        $data = $query->get();
        $count = $data->count();
        Log::info("Export initiated for year: {$this->year}, month: {$this->month}, status: {$this->status}. Total records: {$count}");

        return $data;
    }

    public function headings(): array
    {
        return [
            'ID',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Region',
            'Province',
            'Municipality',
            'Barangay',
            'Street',
            'Zip',
            'Phone Number',
            'Email',
            'Gender',
            'Date of Birth',
            'Age',
            'Educational Attainment',
            'Institution Name',
            'Course',
            'Start Date',
            'End Date',
            'GPA',
            'Source',
            'Other Source',
            'Sourcer',
            'Other Sourcer',
            'Previous Employee',
            'Recruiter',
            'BPO Experience',
            'Application Method',
            'Resume',
            'Skillset',
            'Created At',
            'Application Status ID',
            'Status',
            'First Call',
            'Second Call',
            'Third Call',
            'Communication',
            'Reading',
            'Typing',
            'Problem Solving',
            'Work Ethics',
            'Budget Issues',
            'Remarks',
        ];
    }
}
