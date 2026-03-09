<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barbero_servicio', function (Blueprint $table) {
            $table->uuid('barbero_id');
            $table->uuid('servicio_id');
            $table->primary(['barbero_id', 'servicio_id']);
            $table->foreign('barbero_id')->references('id')->on('barberos')->onDelete('cascade');
            $table->foreign('servicio_id')->references('id')->on('servicios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barbero_servicio');
    }
};
