<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Admin;

class ModeratorController extends Controller
{
    private function authorizeAccess()
    {
        $admin = Auth::user();

        if (!$admin || !($admin->role === 'Admin' && $admin->department === 'IT')) {
            return redirect('/dashboard')->with('error', 'Unauthorized access.');
        }
    }

    public function index(Request $request)
    {
        $redirect = $this->authorizeAccess();
        if ($redirect) {
            return $redirect;
        }

        $search = $request->input('search');
        $sort = $request->input('sort', 'Default');

        $moderators = Admin::select(
            'id',
            'first_name',
            'last_name',
            'email',
            'role',
            'department',
            'password',
        )
        ->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%");
            });
        })
        ->when($sort !== 'Default', function ($query) use ($sort) {
            if ($sort === 'IT') {
                $query->where('department', 'IT');
            } elseif ($sort === 'QA') {
                $query->where('department', 'QA');
            } elseif ($sort === 'RT') {
                $query->where('department', 'RT');
            } elseif ($sort === 'TR') {
                $query->where('department', 'TR');
            }
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        $admin = Auth::user();

        return Inertia::render('Moderator/Moderator', [
            'moderators' => $moderators,
            'admin' => $admin,
            'search' => $search,
            'sort' => $sort,
        ]);
    }

    public function store(Request $request)
    {
        $redirect = $this->authorizeAccess();
        if ($redirect) {
            return $redirect;
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        Admin::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'department' => $validated['department'],
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('moderator.index')->with('success', 'Admin added successfully');
    }

    public function update(Request $request, $id)
    {
        $redirect = $this->authorizeAccess();
        if ($redirect) {
            return $redirect;
        }

        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|max:255',
        ]);

        $moderator = Admin::findOrFail($id);

        if (!empty($validatedData['password'])) {
            $validatedData['password'] = bcrypt($validatedData['password']);
        } else {
            unset($validatedData['password']); 
        }
        $moderator->update($validatedData);

        return redirect()->route('moderator.index')->with('success', 'Admin updated successfully.');
    }

    public function destroy($id)
    {
        $redirect = $this->authorizeAccess();
        if ($redirect) {
            return $redirect;
        }

        $moderator = Admin::findOrFail($id);
        $moderator->delete();

        return redirect()->route('moderator.index')->with('message', 'Admin deleted successfully.');
    }
}
