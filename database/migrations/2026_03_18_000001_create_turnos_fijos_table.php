<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('turnos_fijos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barbero_id');
            $table->uuid('cliente_id');
            $table->tinyInteger('dia_semana')->comment('0=domingo, 1=lunes, ..., 6=sabado');
            $table->time('hora_inicio');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('barbero_id')->references('id')->on('barberos')->onDelete('cascade');
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->unique(['barbero_id', 'dia_semana', 'hora_inicio'], 'unique_turno_fijo');
        });

        Schema::create('turnos_fijos_servicios', function (Blueprint $table) {
            $table->uuid('turno_fijo_id');
            $table->uuid('servicio_id');
            $table->primary(['turno_fijo_id', 'servicio_id']);

            $table->foreign('turno_fijo_id')->references('id')->on('turnos_fijos')->onDelete('cascade');
            $table->foreign('servicio_id')->references('id')->on('servicios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('turnos_fijos_servicios');
        Schema::dropIfExists('turnos_fijos');
    }
};
