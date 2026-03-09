<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venta_detalles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('venta_id');
            $table->uuid('servicio_id');
            $table->decimal('precio_venta', 10, 2);
            $table->decimal('precio_costo', 10, 2);
            $table->decimal('utilidad_neta', 10, 2);
            $table->timestamps();
            $table->foreign('venta_id')->references('id')->on('ventas')->onDelete('cascade');
            $table->foreign('servicio_id')->references('id')->on('servicios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venta_detalles');
    }
};
