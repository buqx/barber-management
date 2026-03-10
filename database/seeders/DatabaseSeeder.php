<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario admin
        \App\Models\User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@barber.com',
            'password' => bcrypt('admin1234'), // Cambia la contraseña después
            'is_admin' => true,
        ]);
    }
}
