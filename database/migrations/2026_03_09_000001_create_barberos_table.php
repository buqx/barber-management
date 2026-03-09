<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barberos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('barberia_id');
            $table->string('nombre');
            $table->string('email')->nullable();
            $table->boolean('es_dueno')->default(false);
            $table->decimal('comision_porcentaje', 5, 2)->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->foreign('barberia_id')->references('id')->on('barberias')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barberos');
    }
};
