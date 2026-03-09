<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barberia_id');
            $table->string('nombre');
            $table->decimal('precio', 10, 2);
            $table->integer('duracion_minutos');
            $table->timestamps();
            $table->foreign('barberia_id')->references('id')->on('barberias')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
