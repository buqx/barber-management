<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bloqueos_excepciones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barbero_id');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->string('motivo')->nullable();
            $table->boolean('todo_el_dia')->default(false);
            $table->timestamps();
            $table->foreign('barbero_id')->references('id')->on('barberos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bloqueos_excepciones');
    }
};
