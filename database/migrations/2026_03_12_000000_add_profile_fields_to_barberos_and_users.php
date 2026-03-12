<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('password');
        });

        Schema::table('barberos', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('barberia_id')->constrained('users')->nullOnDelete();
            $table->string('cedula')->nullable()->after('email');
            $table->string('foto_path')->nullable()->after('cedula');

            $table->unique('user_id');
            $table->unique('cedula');
        });
    }

    public function down(): void
    {
        Schema::table('barberos', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
            $table->dropUnique(['cedula']);
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['cedula', 'foto_path']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar');
        });
    }
};