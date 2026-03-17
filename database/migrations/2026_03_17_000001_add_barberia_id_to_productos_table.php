<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->uuid('barberia_id')->nullable()->after('id');
            $table->foreign('barberia_id')
                ->references('id')
                ->on('barberias')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['barberia_id']);
            $table->dropColumn('barberia_id');
        });
    }
};
