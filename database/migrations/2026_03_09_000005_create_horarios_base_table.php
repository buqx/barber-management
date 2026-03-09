<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('horarios_base', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barbero_id');
            $table->unsignedTinyInteger('dia_semana'); // 0=Domingo, 6=Sábado
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->time('almuerzo_inicio')->nullable();
            $table->time('almuerzo_fin')->nullable();
            $table->timestamps();
            $table->foreign('barbero_id')->references('id')->on('barberos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horarios_base');
    }
};
