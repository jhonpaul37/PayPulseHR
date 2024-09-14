<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EmployeesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Insert a specific employee
        DB::table('employees')->insert([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'middle_name' => 'Michael',
            'birthdate' => '1990-01-01',
            'sex' => 'male',
            'civil_status' => 'single',
            'nationality' => 'American',
            'address' => '123 Main St, Anytown, USA',
            'phone' => '555-1234',
            'email' => 'john.doe@example.com',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '555-5678',

            // Employment details
            'position' => 'Software Developer',
            'department' => 'IT',
            'start_date' => '2020-05-15',
            'employment_type' => 'full-time',

            // Salary & Compensation
            'salary' => 75000.00,
            'pay_frequency' => 'monthly',
            'overtime_rate' => 40.00,

            // Bank information
            'bank_name' => 'Bank of America',
            'bank_account_number' => '123456789',

            // Benefits & Perks
            'insurance_plan' => 'Health Plus',
            'retirement_plan' => '401K',
            'vacation_days' => 10,
            'sick_days' => 5,

            // Legal & Compliance
            'tax_id' => $faker->numerify('##########'),
            'work_authorization' => 'H1B',

            // Performance & Development
            'performance_review' => 'Excellent performance throughout the year.',

            // Attendance & Leave
            'leave_balance' => 15,

            // Resignation/Termination
            'termination_date' => null,
            'termination_reason' => null,

            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert 5 random employees
        foreach (range(1, 5) as $index) {
            DB::table('employees')->insert([
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'middle_name' => $faker->optional()->firstName,
                'birthdate' => $faker->date,
                'sex' => $faker->randomElement(['male', 'female']),
                'civil_status' => $faker->randomElement(['single', 'married']),
                'nationality' => $faker->country,
                'address' => $faker->address,
                'phone' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'emergency_contact_name' => $faker->name,
                'emergency_contact_phone' => $faker->phoneNumber,

                // Employment details
                'position' => $faker->jobTitle,
                'department' => $faker->word,
                'start_date' => $faker->date,
                'employment_type' => $faker->randomElement(['full-time', 'part-time', 'contract']),

                // Salary & Compensation
                'salary' => $faker->randomFloat(2, 30000, 100000),
                'pay_frequency' => $faker->randomElement(['monthly', 'bi-weekly']),
                'overtime_rate' => $faker->optional()->randomFloat(2, 10, 50),

                // Bank information
                'bank_name' => $faker->company,
                'bank_account_number' => $faker->bankAccountNumber,

                // Benefits & Perks
                'insurance_plan' => $faker->optional()->word,
                'retirement_plan' => $faker->optional()->word,
                'vacation_days' => $faker->numberBetween(0, 20),
                'sick_days' => $faker->numberBetween(0, 10),

                // Legal & Compliance
                'tax_id' => $faker->numerify('##########'),
                'work_authorization' => $faker->optional()->word,

                // Performance & Development
                'performance_review' => $faker->optional()->sentence,

                // Attendance & Leave
                'leave_balance' => $faker->numberBetween(0, 30),

                // Resignation/Termination
                'termination_date' => $faker->optional()->date,
                'termination_reason' => $faker->optional()->sentence,

                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
