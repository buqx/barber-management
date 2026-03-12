<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->uuid('cita_id')->nullable()->after('barberia_id');
            $table->uuid('barbero_id')->nullable()->after('cliente_id');
            $table->string('tipo_origen')->default('mostrador')->after('barbero_id');
            $table->string('estado')->default('pagada')->after('tipo_origen');
            $table->decimal('subtotal', 10, 2)->default(0)->after('estado');
            $table->decimal('descuento', 10, 2)->default(0)->after('subtotal');
            $table->text('observaciones')->nullable()->after('utilidad_neta');

            $table->foreign('cita_id')->references('id')->on('citas')->nullOnDelete();
            $table->foreign('barbero_id')->references('id')->on('barberos')->nullOnDelete();
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->uuid('cliente_id')->nullable()->change();
        });

        DB::table('ventas')->update([
            'tipo_origen' => 'mostrador',
            'estado' => 'pagada',
            'subtotal' => DB::raw('total'),
            'descuento' => 0,
        ]);

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->string('tipo_item')->default('servicio')->after('venta_id');
            $table->uuid('producto_id')->nullable()->after('servicio_id');
            $table->string('descripcion')->nullable()->after('producto_id');
            $table->integer('cantidad')->default(1)->after('descripcion');
            $table->decimal('subtotal', 10, 2)->default(0)->after('precio_costo');

            $table->foreign('producto_id')->references('id')->on('productos')->nullOnDelete();
        });

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->uuid('servicio_id')->nullable()->change();
        });

        DB::table('venta_detalles')->update([
            'tipo_item' => 'servicio',
            'cantidad' => 1,
            'subtotal' => DB::raw('precio_venta'),
        ]);

        Schema::create('inventario_movimientos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('producto_id');
            $table->uuid('venta_id')->nullable();
            $table->uuid('venta_detalle_id')->nullable();
            $table->string('tipo');
            $table->integer('cantidad');
            $table->integer('stock_anterior');
            $table->integer('stock_posterior');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
            $table->foreign('venta_id')->references('id')->on('ventas')->nullOnDelete();
            $table->foreign('venta_detalle_id')->references('id')->on('venta_detalles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventario_movimientos');

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->dropForeign(['producto_id']);
            $table->dropColumn(['tipo_item', 'producto_id', 'descripcion', 'cantidad', 'subtotal']);
        });

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->uuid('servicio_id')->nullable(false)->change();
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->dropForeign(['cita_id']);
            $table->dropForeign(['barbero_id']);
            $table->dropColumn(['cita_id', 'barbero_id', 'tipo_origen', 'estado', 'subtotal', 'descuento', 'observaciones']);
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->uuid('cliente_id')->nullable(false)->change();
        });
    }
};