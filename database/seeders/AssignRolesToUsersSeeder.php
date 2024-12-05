<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignRolesToUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $accRole = Role::create(['name' => 'acc']);
        $cashierRole = Role::create(['name' => 'cashier']);
        $hrRole = Role::create(['name' => 'hr']);
        $employeeRole = Role::create(['name' => 'employee']);

        // Assign roles to users (example for user with ID 1)
        $user = User::find(1);
        if ($user) {
            $user->assignRole('admin');
        }

        // Example: Assign roles to other users if necessary
        $user2 = User::find(2);
        if ($user2) {
            $user2->assignRole('acc');
        }

        $user3 = User::find(3);
        if ($user3) {
            $user3->assignRole('cashier');
        }

        // Add other users as needed
    }
}
