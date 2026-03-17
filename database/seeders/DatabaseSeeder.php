<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario admin global
        User::firstOrCreate(
            ['email' => 'admin@barber.com'],
            [
                'name' => 'Administrador',
                'password' => bcrypt('admin1234'),
                'is_admin' => true,
            ]
        );

        // Ejecutar seeder de Barbería Malabar
        $this->call([
            BarberiaMalabarSeeder::class,
        ]);
    }
}
