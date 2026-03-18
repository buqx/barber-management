<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('barberos', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('nombre');
            $table->boolean('booking_publico')->default(true)->after('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barberos', function (Blueprint $table) {
            $table->dropColumn(['slug', 'booking_publico']);
        });
    }
};
