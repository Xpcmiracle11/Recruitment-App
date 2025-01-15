<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applicants Report</title>
    <style>
        @page {
            size: landscape;
            margin: 15mm;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px; 
        }

        th, td {
            padding: 4px 8px;
            border: 1px solid #ccc;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        th:nth-child(1), td:nth-child(1) { width: 5%; }
        th:nth-child(2), td:nth-child(2) { width: 8%; }
        th:nth-child(3), td:nth-child(3) { width: 8%; }
        th:nth-child(4), td:nth-child(4) { width: 8%; }
        th:nth-child(5), td:nth-child(5) { width: 5%; }
        th:nth-child(6), td:nth-child(6) { width: 8%; }
        th:nth-child(7), td:nth-child(7) { width: 8%; }
        th:nth-child(8), td:nth-child(8) { width: 8%; }
        th:nth-child(9), td:nth-child(9) { width: 8%; }

        tbody tr {
            page-break-inside: avoid;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <h1>Applicants Report</h1>
    <p>Year: {{ $year }}</p>
    <p>Month: {{ $month }}</p>
    <p>Status: {{ $status }}</p>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Region</th>
                <th>Province</th>
                <th>Municipality</th>
                <th>Barangay</th>
                <th>Street</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Age</th>
                <th>Educational Attainment</th>
                <th>Institution Name</th>
                <th>Course</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applicants as $key => $applicant)
                <tr>
                    <td>{{ $applicant->id }}</td>
                    <td>{{ $applicant->first_name }}</td>
                    <td>{{ $applicant->middle_name }}</td>
                    <td>{{ $applicant->last_name }}</td>
                    <td>{{ $applicant->region }}</td>
                    <td>{{ $applicant->province }}</td>
                    <td>{{ $applicant->municipality }}</td>
                    <td>{{ $applicant->barangay }}</td>
                    <td>{{ $applicant->street }}</td>
                    <td>{{ $applicant->phone_number }}</td>
                    <td>{{ $applicant->email }}</td>
                    <td>{{ $applicant->gender }}</td>
                    <td>{{ $applicant->dob }}</td>
                    <td>{{ $applicant->age }}</td>
                    <td>{{ $applicant->educational_attainment }}</td>
                    <td>{{ $applicant->institution_name }}</td>
                    <td>{{ $applicant->course }}</td>
                    <td>{{ $applicant->status }}</td>
                </tr>
                @if (($key + 1) % 20 == 0)
                    <tr class="page-break"><td colspan="18"></td></tr>
                @endif
            @endforeach
        </tbody>
    </table>
</body>
</html>
