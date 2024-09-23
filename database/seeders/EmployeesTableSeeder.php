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
         $employees = [
            [
                'employee_id' => 'A-001',
                'first_name' => 'Rhea Angellica',
                'last_name' => 'Addatu',
                'middle_name' => 'B.',
                'position' => 'Accountant II',
                'salary' => 39672.00,
                'step' => 1,
            ],
            [
                'employee_id' => 'A-002',
                'first_name' => 'Marvin Keith',
                'last_name' => 'Alavado',
                'middle_name' => 'C.',
                'position' => 'Administrative Assistant II',
                'salary' => 19744.00,
                'step' => 1,
            ],
            [
                'employee_id' => 'A-003',
                'first_name' => 'Jenny',
                'last_name' => 'Alina',
                'middle_name' => 'S.',
                'position' => 'Nurse II',
                'salary' => 40088.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-004',
                'first_name' => 'Emilyn',
                'last_name' => 'Alueta',
                'middle_name' => 'D.',
                'position' => 'Cashier I',
                'salary' => 24567.00,
                'step' => 8,
            ],
            [
                'employee_id' => 'A-005',
                'first_name' => 'Romina Katrina',
                'last_name' => 'Bernardo',
                'middle_name' => 'B.',
                'position' => 'HRMO III',
                'salary' => 47288.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-006',
                'first_name' => 'William Jo Se',
                'last_name' => 'Billote',
                'middle_name' => 'M.',
                'position' => 'Records Officer III',
                'salary' => 46725.00,
                'step' => 1,
            ],
            [
                'employee_id' => 'A-007',
                'first_name' => 'Randy',
                'last_name' => 'Cabanillas',
                'middle_name' => 'F.',
                'position' => 'Supply Officer I',
                'salary' => 23762.00,
                'step' => 4,
            ],
            [
                'employee_id' => 'A-008',
                'first_name' => 'Jershon Ralph',
                'last_name' => 'Castaño',
                'middle_name' => 'F.',
                'position' => 'Administrative Aide III',
                'salary' => 14792.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-009',
                'first_name' => 'Edward',
                'last_name' => 'Castillo',
                'middle_name' => 'V.',
                'position' => 'Watchman II',
                'salary' => 14032.00,
                'step' => 3,
            ],
             [
                'employee_id' => 'A-010',
                'first_name' => 'Bryan',
                'last_name' => 'Cielo',
                'middle_name' => 'H.',
                'position' => 'Administrative Aide I',
                'salary' => 13219.00,
                'step' => 3,
            ],
            [
                'employee_id' => 'A-011',
                'first_name' => 'Djovi',
                'last_name' => 'Durante',
                'middle_name' => 'R.',
                'position' => 'SUC President I',
                'salary' => 131124.00,
                'step' => 1,
            ],
            [
                'employee_id' => 'A-012',
                'first_name' => 'Wilfredo',
                'last_name' => 'Eriful',
                'middle_name' => 'V.',
                'position' => 'Watchman II',
                'salary' => 14032.00,
                'step' => 3,
            ],
            [
                'employee_id' => 'A-013',
                'first_name' => 'Ruben',
                'last_name' => 'Ferrer',
                'middle_name' => 'D.',
                'position' => 'Administrative Aide VI',
                'salary' => 17688.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-014',
                'first_name' => 'Arnel',
                'last_name' => 'Pableo',
                'middle_name' => 'D.',
                'position' => 'Administrative Aide III',
                'salary' => 14792.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-015',
                'first_name' => 'Roderick',
                'last_name' => 'Ramos',
                'middle_name' => 'B.',
                'position' => 'Librarian II',
                'salary' => 29449.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-016',
                'first_name' => 'Bryan Dave',
                'last_name' => 'Revilla',
                'middle_name' => 'P.',
                'position' => 'Budget Officer III',
                'salary' => 47228.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-017',
                'first_name' => 'Anne Marielle',
                'last_name' => 'Teves',
                'middle_name' => 'V.',
                'position' => 'Administrative Assistant II',
                'salary' => 19923.00,
                'step' => 2,
            ],
            [
                'employee_id' => 'A-018',
                'first_name' => 'Richard',
                'last_name' => 'Vinalay',
                'middle_name' => 'B.',
                'position' => 'Administrative Aide II',
                'salary' => 14032.00,
                'step' => 3,
            ],
            [
                'employee_id' => 'A-019',
                'first_name' => 'Paola Joy',
                'last_name' => 'Santiago',
                'middle_name' => 'E.',
                'position' => 'Information Officer II',
                'salary' => 36619.00,
                'step' => 1,
            ],


        ];

        foreach ($employees as $employee) {
            DB::table('employees')->insert([
                'employee_id' => $employee['employee_id'],
                'first_name' => $employee['first_name'],
                'last_name' => $employee['last_name'],
                'middle_name' => $employee['middle_name'],
                'birthdate' => '1990-01-01', // Placeholder
                'sex' => 'not specified', // Placeholder
                'civil_status' => 'not specified', // Placeholder
                'nationality' => 'Filipino', // Assumption
                'address' => 'Address not provided', // Placeholder
                'phone' => 'Phone not provided', // Placeholder
                'email' => strtolower($employee['first_name'] . '.' . $employee['last_name'] . '@example.com'),
                'position' => $employee['position'],
                'department' => 'Not specified', // Placeholder
                'start_date' => '2023-01-01', // Placeholder
                'employment_type' => 'full-time', // Assumption
                'salary' => $employee['salary'],
                'vacation_days' => 10, // Placeholder
                'sick_days' => 5, // Placeholder
                'leave_balance' => 15, // Placeholder
                'termination_date' => null,
                'termination_reason' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

