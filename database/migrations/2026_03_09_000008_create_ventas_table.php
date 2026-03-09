<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barberia_id');
            $table->uuid('cliente_id');
            $table->decimal('total', 10, 2);
            $table->decimal('utilidad_neta', 10, 2);
            $table->timestamps();
            $table->foreign('barberia_id')->references('id')->on('barberias')->onDelete('cascade');
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
