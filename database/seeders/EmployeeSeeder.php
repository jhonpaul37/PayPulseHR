<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        // Sample employee data
        $employees = [
            [
                'employee_id' => 'E001',
                'first_name' => 'Zedrick Keil',
                'last_name' => 'Danila',
                'middle_name' => 'D',
                'birthdate' => '1990-05-15',
                'sex' => 'Male',
                'civil_status' => 'Single',
                'nationality' => 'Filipino',
                'address' => '123 Main St, Manila',
                'phone' => '09171234567',
                'email' => 'maeve@gmail.com',
                'password' => '3-r9R5sBd8Uz2vt',
                'position' => 'Software Engineer',
                'department' => 'IT',
                'start_date' => '2020-01-15',
                'employment_type' => 'Full-time',
                'salary_grade_id' => 1,
                'termination_date' => null,
                'termination_reason' => null,
                'photo' => null,
            ],
        ];

        foreach ($employees as $data) {
            // Create the user
            $user = User::create([
                'name' => $data['first_name'] . ' ' . $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            // Add user ID to employee data and hash the password
            $data['user_id'] = $user->id;
            $data['password'] = Hash::make($data['password']);

            // Create employee record
            Employee::create($data);
        }
    }
}
