<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

    return [
        'jev_no' => fake()->text(),
        'ors_burs_no' => fake()->numberBetween(1, 1000), // Assuming you want a random integer between 1 and 1000
        'f_cluster' => fake()->word(),
        'div_num' => fake()->randomNumber(),
        'uacs_code' => fake()->numberBetween(1, 1000), // Assuming you want a random integer between 1 and 1000
        'user_id' => fake()->randomNumber(),
    ];

    }
}
