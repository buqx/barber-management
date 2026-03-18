<?php

namespace Database\Seeders;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Catalogo\Productos\Models\Producto;
use App\Domain\Configuracion\Horarios\Models\TurnoFijo;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BarberiaMalabarSeeder extends Seeder
{
    public function run(): void
    {
        // Eliminar datos existentes para干净 inicio
        $this->command->info('🗑️ Limpiando datos existentes...');

        // Eliminar citas
        Appointment::whereHas('barberia', function ($query) {
            $query->where('slug', 'barberia-malabar');
        })->delete();

        // Eliminar turnos fijos
        TurnoFijo::whereHas('barbero', function ($query) {
            $query->whereHas('barberia', function ($q) {
                $q->where('slug', 'barberia-malabar');
            });
        })->delete();

        // Eliminar productos
        Producto::whereHas('barberia', function ($query) {
            $query->where('slug', 'barberia-malabar');
        })->delete();

        // Eliminar clientes
        Cliente::whereHas('barberia', function ($query) {
            $query->where('slug', 'barberia-malabar');
        })->delete();

        // Eliminar servicios
        Servicio::whereHas('barberia', function ($query) {
            $query->where('slug', 'barberia-malabar');
        })->delete();

        // Eliminar barberos
        Barbero::whereHas('barberia', function ($query) {
            $query->where('slug', 'barberia-malabar');
        })->delete();

        // Eliminar barbería
        Barberia::where('slug', 'barberia-malabar')->delete();

        $this->command->info('✅ Limpieza completada.');

        // 1. Crear la barbería
        $barberia = Barberia::create([
            'id' => Str::uuid()->toString(),
            'nombre' => 'Barbería Malabar',
            'slug' => 'barberia-malabar',
            'logo_url' => null,
            'color_primario' => '#d97706',
            'color_secundario' => '#fffbeb',
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

        // 2. Crear el usuario para Juan Valencia
        $user = User::create([
            'name' => 'Juan Valencia',
            'email' => 'juan.valencia@malabar.com',
            'password' => bcrypt('1002608'),
            'is_admin' => false,
        ]);

        // 3. Crear el barbero (dueño)
        $barbero = Barbero::create([
            'id' => Str::uuid()->toString(),
            'barberia_id' => $barberia->id,
            'user_id' => $user->id,
            'nombre' => 'Juan Valencia',
            'email' => 'juan.valencia@malabar.com',
            'cedula' => '1002608',
            'slug' => 'juan-valencia-' . substr(Str::random(6), 0, 6),
            'es_dueno' => true,
            'comision_porcentaje' => 100,
            'activo' => true,
            'booking_publico' => true,
        ]);

        // 4. Crear servicios
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

        $serviciosCreados = [];
        foreach ($servicios as $servicio) {
            $servicioModel = Servicio::create([
                'id' => Str::uuid()->toString(),
                'barberia_id' => $barberia->id,
                'nombre' => $servicio['nombre'],
                'precio' => $servicio['precio'],
                'duracion_minutos' => $servicio['duracion_minutos'],
            ]);
            $barbero->servicios()->attach($servicioModel->id);
            $serviciosCreados[] = $servicioModel;
        }

        // 5. Crear productos
        $productos = [
            ['nombre' => 'Pomada Modeladora', 'precio_venta' => 18000, 'precio_costo' => 10000, 'stock_actual' => 15],
            ['nombre' => 'Cera para Barba', 'precio_venta' => 22000, 'precio_costo' => 12000, 'stock_actual' => 8],
            ['nombre' => 'Shampoo Capilar', 'precio_venta' => 25000, 'precio_costo' => 14000, 'stock_actual' => 20],
            ['nombre' => 'Afeitadora Desechable', 'precio_venta' => 5000, 'precio_costo' => 2000, 'stock_actual' => 50],
            ['nombre' => 'Crema Post-Shave', 'precio_venta' => 20000, 'precio_costo' => 10000, 'stock_actual' => 12],
            ['nombre' => 'Oil para Barba', 'precio_venta' => 28000, 'precio_costo' => 15000, 'stock_actual' => 6],
            ['nombre' => 'Peine de Madera', 'precio_venta' => 12000, 'precio_costo' => 5000, 'stock_actual' => 25],
            ['nombre' => 'Tijeras de Peluquería', 'precio_venta' => 45000, 'precio_costo' => 25000, 'stock_actual' => 3],
        ];

        foreach ($productos as $producto) {
            Producto::create([
                'id' => Str::uuid()->toString(),
                'barberia_id' => $barberia->id,
                'nombre' => $producto['nombre'],
                'precio_venta' => $producto['precio_venta'],
                'precio_costo' => $producto['precio_costo'],
                'stock_actual' => $producto['stock_actual'],
            ]);
        }

        $this->command->info('✅ Servicios y productos creados.');

        // 6. Crear clientes con el correo especificado
        $clientes = [
            ['nombre' => 'Carlos Mendoza', 'email' => 'vjuanesteban569@gmail.com', 'telefono' => '+57 315 234 5678'],
            ['nombre' => 'Pedro Gómez', 'email' => 'vjuanesteban569@gmail.com', 'telefono' => '+57 312 345 6789'],
            ['nombre' => 'María López', 'email' => 'vjuanesteban569@gmail.com', 'telefono' => '+57 310 456 7890'],
            ['nombre' => 'Jorge Ramírez', 'email' => 'vjuanesteban569@gmail.com', 'telefono' => '+57 311 567 8901'],
            ['nombre' => 'Ana García', 'email' => 'vjuanesteban569@gmail.com', 'telefono' => '+57 320 678 9012'],
            ['nombre' => 'Luis Martínez', 'email' => 'vjuanesteban569@gmail.com', 'telefono' => '+57 321 789 0123'],
        ];

        $clientesCreados = [];
        foreach ($clientes as $cliente) {
            $clienteModel = Cliente::create([
                'id' => Str::uuid()->toString(),
                'barberia_id' => $barberia->id,
                'nombre' => $cliente['nombre'],
                'email' => $cliente['email'],
                'telefono' => $cliente['telefono'],
            ]);
            $clientesCreados[] = $clienteModel;
        }

        // 7. Crear citas pendientes
        $hoy = Carbon::today();

        $citasPendientes = [
            // Citas para hoy
            [
                'cliente' => $clientesCreados[0], // Carlos
                'fecha' => $hoy->copy(),
                'hora_inicio' => '10:00',
                'hora_fin' => '10:30',
                'servicio' => $serviciosCreados[0], // Corte
            ],
            [
                'cliente' => $clientesCreados[1], // Pedro
                'fecha' => $hoy->copy(),
                'hora_inicio' => '11:00',
                'hora_fin' => '11:45',
                'servicio' => $serviciosCreados[2], // Corte + Barba
            ],
            [
                'cliente' => $clientesCreados[2], // María
                'fecha' => $hoy->copy(),
                'hora_inicio' => '14:00',
                'hora_fin' => '14:25',
                'servicio' => $serviciosCreados[3], // Afeitado
            ],
            // Citas para mañana
            [
                'cliente' => $clientesCreados[3], // Jorge
                'fecha' => $hoy->copy()->addDay(),
                'hora_inicio' => '09:00',
                'hora_fin' => '09:30',
                'servicio' => $serviciosCreados[0], // Corte
            ],
            [
                'cliente' => $clientesCreados[4], // Ana
                'fecha' => $hoy->copy()->addDay(),
                'hora_inicio' => '15:00',
                'hora_fin' => '15:40',
                'servicio' => $serviciosCreados[4], // Tratamiento
            ],
            // Citas para pasado mañana
            [
                'cliente' => $clientesCreados[5], // Luis
                'fecha' => $hoy->copy()->addDays(2),
                'hora_inicio' => '11:30',
                'hora_fin' => '12:15',
                'servicio' => $serviciosCreados[2], // Corte + Barba
            ],
        ];

        foreach ($citasPendientes as $citaData) {
            Appointment::create([
                'id' => Str::uuid()->toString(),
                'barberia_id' => $barberia->id,
                'barbero_id' => $barbero->id,
                'cliente_id' => $citaData['cliente']->id,
                'inicio_at' => $citaData['fecha']->copy()->setTimeFromTimeString($citaData['hora_inicio']),
                'fin_at' => $citaData['fecha']->copy()->setTimeFromTimeString($citaData['hora_fin']),
                'estado' => 'pendiente',
                'total_pagado' => 0,
            ]);
        }

        $this->command->info('✅ Citas pendientes creadas: ' . count($citasPendientes));

        // 8. Crear algunos turnos fijos
        $servicioCorte = $serviciosCreados[0];
        $servicioBarba = $serviciosCreados[1];
        $servicioCorteBarba = $serviciosCreados[2];

        // Turno fijo: Carlos viene todos los sábados
        $turnoFijo1 = TurnoFijo::create([
            'id' => Str::uuid()->toString(),
            'barbero_id' => $barbero->id,
            'cliente_id' => $clientesCreados[0]->id,
            'dia_semana' => 6,
            'hora_inicio' => '10:00',
            'activo' => true,
        ]);
        $turnoFijo1->servicios()->attach($servicioCorteBarba->id);

        // Turno fijo: Pedro viene todos los lunes
        $turnoFijo2 = TurnoFijo::create([
            'id' => Str::uuid()->toString(),
            'barbero_id' => $barbero->id,
            'cliente_id' => $clientesCreados[1]->id,
            'dia_semana' => 1,
            'hora_inicio' => '09:00',
            'activo' => true,
        ]);
        $turnoFijo2->servicios()->attach($servicioCorte->id);

        $this->command->info('✅ Turnos fijos creados.');

        $this->command->info('');
        $this->command->info('🎉 Seeder completado exitosamente!');
        $this->command->info('📧 Email de acceso: juan.valencia@malabar.com');
        $this->command->info('🔑 Contraseña: 1002608');
        $this->command->info('🌐 Booking: /barberia-malabar/booking');
        $this->command->info('👤 Citas de clientes con email: vjuanesteban569@gmail.com');
    }
}
