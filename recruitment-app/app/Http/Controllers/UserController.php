<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{   
    public function index(Request $request)
    {
        $applicants = User::select(
            'id',
            'first_name',
            'middle_name',
            'last_name',
            'phone_number',
            'email',
            'created_at',
        )->get();

        return Inertia::render('Signup',[
            'applicants' => $applicants,
        ]);
    }

    public function store(Request $request)
{ 
    try {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'region' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'zip' => 'required|string|max:10',
            'phone_number' => 'required|string|max:15',
            'email' => 'required|string|email|max:255',
            'gender' => 'required|string|max:10',
            'dob' => 'required|date',
            'age' => 'required|integer',
            'educational_attainment' => 'required|string|max:255',
            'institution_name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'gpa' => 'required|numeric',
            'source' => 'required|string|max:255',
            'other_source' => 'nullable|string|max:255',
            'sourcer' => 'required|string|max:255',
            'other_sourcer' => 'nullable|string|max:255',
            'previous_employee' => 'required|string|max:255',
            'recruiter' => 'required|string|max:255',
            'bpo_experience' => 'nullable|string|max:255',
            'application_method' => 'required|string|max:255',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'skillset' => 'required|string|max:255',
        ]);
        $user = User::create($validatedData);

        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $fileName = strtolower($validatedData['first_name'] . '_' . $validatedData['last_name'] . '_' . $user->id . '.' . $file->getClientOriginalExtension());
            $file->storeAs('resume', $fileName);
            $user->update(['resume' => $fileName]);
        }

        DB::table('application_status')->insert([
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'User created successfully!');
    } catch (Exception $e) {
        return redirect()->back()->withErrors(['error' => 'An error occurred while creating the user.']);
    }
}

}
