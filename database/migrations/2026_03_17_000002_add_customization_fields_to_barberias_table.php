<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('barberias', function (Blueprint $table) {
            // Colores (hexadecimal)
            $table->string('color_primario', 7)->default('#1a1a1a')->after('logo_url');
            $table->string('color_secundario', 7)->default('#f5f5f5')->after('color_primario');

            // Imagen de banner/portada
            $table->string('banner_url')->nullable()->after('color_secundario');

            // Información de contacto
            $table->text('descripcion')->nullable()->after('banner_url');
            $table->string('telefono', 20)->nullable()->after('descripcion');
            $table->string('direccion', 255)->nullable()->after('telefono');

            // Redes sociales
            $table->string('facebook_url')->nullable()->after('direccion');
            $table->string('instagram_url')->nullable()->after('facebook_url');

            // Horario de atención (texto libre)
            $table->text('horario_atencion')->nullable()->after('instagram_url');

            // Configuración del booking
            $table->boolean('booking_habilitado')->default(true)->after('horario_atencion');
            $table->integer('dias_anticipacion')->default(30)->after('booking_habilitado'); // días con anticipación
            $table->integer('intervalo_citas')->default(30)->after('dias_anticipacion'); // minutos entre citas
        });
    }

    public function down(): void
    {
        Schema::table('barberias', function (Blueprint $table) {
            $table->dropColumn([
                'color_primario',
                'color_secundario',
                'banner_url',
                'descripcion',
                'telefono',
                'direccion',
                'facebook_url',
                'instagram_url',
                'horario_atencion',
                'booking_habilitado',
                'dias_anticipacion',
                'intervalo_citas',
            ]);
        });
    }
};
