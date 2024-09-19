<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EmployeesTableSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Insert a specific employee
        DB::table('employees')->insert([
            'employee_id' => 'EMP001',
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
            'position' => 'Software Developer',
            'department' => 'IT',
            'start_date' => '2020-05-15',
            'employment_type' => 'full-time',
            'salary' => 75000.00,
            'vacation_days' => 10,
            'sick_days' => 5,
            'leave_balance' => 15,
            'termination_date' => null,
            'termination_reason' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert 5 random employees
        foreach (range(1, 5) as $index) {
            DB::table('employees')->insert([
                'employee_id' => $faker->unique()->bothify('EMP###'),
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
                'position' => $faker->jobTitle,
                'department' => $faker->word,
                'start_date' => $faker->date,
                'employment_type' => $faker->randomElement(['full-time', 'part-time', 'contract']),
                'salary' => $faker->randomFloat(2, 30000, 100000),
                'vacation_days' => $faker->numberBetween(0, 20),
                'sick_days' => $faker->numberBetween(0, 10),
                'leave_balance' => $faker->numberBetween(0, 30),
                'termination_date' => $faker->optional()->date,
                'termination_reason' => $faker->optional()->sentence,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

