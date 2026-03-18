<?php

namespace Database\Seeders;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Configuracion\Horarios\Models\TurnoFijo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BarberiaMalabarSeeder extends Seeder
{
    public function run(): void
    {
        // Verificar si ya existe la barbería
        $barberia = Barberia::where('slug', 'barberia-malabar')->first();

        if (!$barberia) {
            // 1. Crear la barbería
            $barberia = Barberia::create([
                'id' => Str::uuid()->toString(),
                'nombre' => 'Barbería Malabar',
                'slug' => 'barberia-malabar',
                'logo_url' => null,
                'color_primario' => '#d97706', // Ámbar/naranja
                'color_secundario' => '#fffbeb', // Crema claro
                'banner_url' => null,
                'descripcion' => 'Barbería Malabar - Donde el estilo encuentra su destino. Servicios profesionales de barbería con más de 10 años de experiencia.',
                'telefono' => '+57 300 123 4567',
                'direccion' => 'Carrera 45 #12-34, Bogotá, Colombia',
                'facebook_url' => 'https://facebook.com/barberiamalabar',
                'instagram_url' => 'https://instagram.com/barberiamalabar',
                'horario_atencion' => "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 9:00 AM - 5:00 PM\nDomingos: Cerrado",
                'moneda' => 'COP',
                'timezone' => 'America/Bogota',
                'booking_habilitado' => true,
                'dias_anticipacion' => 30,
                'intervalo_citas' => 30,
            ]);

            // 2. Crear el usuario para Juan Valencia (NO es admin global, es dueño de barbería)
            $user = User::create([
                'name' => 'Juan Valencia',
                'email' => 'juan.valencia@malabar.com',
                'password' => bcrypt('1002608'), // Contraseña = CC
                'is_admin' => false, // No es admin global, es dueño de barbería
            ]);

            // 3. Crear el barbero (dueño)
            $barbero = Barbero::create([
                'id' => Str::uuid()->toString(),
                'barberia_id' => $barberia->id,
                'user_id' => $user->id,
                'nombre' => 'Juan Valencia',
                'email' => 'juan.valencia@malabar.com',
                'cedula' => '1002608',
                'es_dueno' => true,
                'comision_porcentaje' => 100, // 100% porque es el dueño
                'activo' => true,
            ]);

            // 4. Crear servicios de ejemplo
            $servicios = [
                ['nombre' => 'Corte de Cabello', 'precio' => 25000, 'duracion_minutos' => 30],
                ['nombre' => 'Arreglo de Barba', 'precio' => 15000, 'duracion_minutos' => 20],
                ['nombre' => 'Corte + Barba', 'precio' => 35000, 'duracion_minutos' => 45],
                ['nombre' => 'Afeitado Clásico', 'precio' => 20000, 'duracion_minutos' => 25],
                ['nombre' => 'Tratamiento Capilar', 'precio' => 30000, 'duracion_minutos' => 40],
                ['nombre' => 'Coloración', 'precio' => 45000, 'duracion_minutos' => 60],
                ['nombre' => 'Peinado', 'precio' => 18000, 'duracion_minutos' => 20],
                ['nombre' => 'Mask Facial', 'precio' => 22000, 'duracion_minutos' => 30],
            ];

            foreach ($servicios as $servicio) {
                $servicioModel = Servicio::create([
                    'id' => Str::uuid()->toString(),
                    'barberia_id' => $barberia->id,
                    'nombre' => $servicio['nombre'],
                    'precio' => $servicio['precio'],
                    'duracion_minutos' => $servicio['duracion_minutos'],
                ]);
                $barbero->servicios()->attach($servicioModel->id);
            }

            // 5. Crear clientes de ejemplo
            $clientes = [
                ['nombre' => 'Carlos Mendoza', 'email' => 'carlos.m@email.com', 'telefono' => '+57 315 234 5678'],
                ['nombre' => 'Pedro Gómez', 'email' => 'pedro.g@email.com', 'telefono' => '+57 312 345 6789'],
                ['nombre' => 'María López', 'email' => 'maria.l@email.com', 'telefono' => '+57 310 456 7890'],
                ['nombre' => 'Jorge Ramírez', 'email' => 'jorge.r@email.com', 'telefono' => '+57 311 567 8901'],
            ];

            foreach ($clientes as $cliente) {
                Cliente::create([
                    'id' => Str::uuid()->toString(),
                    'barberia_id' => $barberia->id,
                    'nombre' => $cliente['nombre'],
                    'email' => $cliente['email'],
                    'telefono' => $cliente['telefono'],
                ]);
            }

            $this->command->info('✅ Barbería Malabar creada exitosamente!');
        } else {
            $this->command->info('ℹ️  La barbería Barbería Malabar ya existe, omitiendo creación de datos base.');
        }

        // Obtener referencias existentes
        $barbero = Barbero::where('email', 'juan.valencia@malabar.com')->first();

        if ($barbero) {
            // Verificar si ya hay turnos fijos
            $turnosExistentes = TurnoFijo::where('barbero_id', $barbero->id)->count();

            if ($turnosExistentes === 0) {
                // Obtener servicios
                $servicioCorte = Servicio::where('barberia_id', $barberia->id)->where('nombre', 'Corte de Cabello')->first();
                $servicioBarba = Servicio::where('barberia_id', $barberia->id)->where('nombre', 'Arreglo de Barba')->first();
                $servicioCorteBarba = Servicio::where('barberia_id', $barberia->id)->where('nombre', 'Corte + Barba')->first();

                // Obtener clientes
                $clienteCarlos = Cliente::where('email', 'carlos.m@email.com')->first();
                $clientePedro = Cliente::where('email', 'pedro.g@email.com')->first();

                // Turno fijo: Carlos viene todos los sábados a las 10:00 (Corte + Barba)
                if ($clienteCarlos && $servicioCorteBarba) {
                    $turnoFijo1 = TurnoFijo::create([
                        'id' => Str::uuid()->toString(),
                        'barbero_id' => $barbero->id,
                        'cliente_id' => $clienteCarlos->id,
                        'dia_semana' => 6, // Sábado
                        'hora_inicio' => '10:00',
                        'activo' => true,
                    ]);
                    $turnoFijo1->servicios()->attach($servicioCorteBarba->id);
                }

                // Turno fijo: Pedro viene todos los lunes a las 9:00 (Corte)
                if ($clientePedro && $servicioCorte) {
                    $turnoFijo2 = TurnoFijo::create([
                        'id' => Str::uuid()->toString(),
                        'barbero_id' => $barbero->id,
                        'cliente_id' => $clientePedro->id,
                        'dia_semana' => 1, // Lunes
                        'hora_inicio' => '09:00',
                        'activo' => true,
                    ]);
                    $turnoFijo2->servicios()->attach($servicioCorte->id);
                }

                // Turno fijo: Pedro viene todos los miércoles a las 15:00 (Arreglo de Barba)
                if ($clientePedro && $servicioBarba) {
                    $turnoFijo3 = TurnoFijo::create([
                        'id' => Str::uuid()->toString(),
                        'barbero_id' => $barbero->id,
                        'cliente_id' => $clientePedro->id,
                        'dia_semana' => 3, // Miércoles
                        'hora_inicio' => '15:00',
                        'activo' => true,
                    ]);
                    $turnoFijo3->servicios()->attach($servicioBarba->id);
                }

                $this->command->info('✅ Turnos fijos creados: 3 turnos para clientes recurrentes');
            } else {
                $this->command->info('ℹ️  Ya existen turnos fijos para esta barbería.');
            }
        }

        $this->command->info('📧 Email: juan.valencia@malabar.com');
        $this->command->info('🔑 Contraseña: 1002608');
        $this->command->info('🌐 Booking: /barberia-malabar/booking');
    }
}
