<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barberia_id');
            $table->uuid('barbero_id');
            $table->uuid('cliente_id');
            $table->dateTime('inicio_at');
            $table->dateTime('fin_at');
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada', 'completada']);
            $table->decimal('total_pagado', 10, 2)->default(0);
            $table->timestamps();
            $table->foreign('barberia_id')->references('id')->on('barberias')->onDelete('cascade');
            $table->foreign('barbero_id')->references('id')->on('barberos')->onDelete('cascade');
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
