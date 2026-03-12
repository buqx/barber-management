<?php

namespace App\Domain\Ventas\Gestion\Services;

use App\Domain\Catalogo\Productos\Models\InventarioMovimiento;
use App\Domain\Catalogo\Productos\Models\Producto;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Ventas\Gestion\Models\Venta;
use App\Domain\Ventas\Gestion\Models\VentaDetalle;
use App\Domain\Ventas\Gestion\Repositories\Contracts\VentaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class VentaService
{
    public function __construct(
        protected VentaRepositoryInterface $ventaRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->ventaRepository->findAll();
    }

    public function getById(string $id): ?Venta
    {
        return $this->ventaRepository->findById($id);
    }

    public function create(array $data): Venta
    {
        return DB::transaction(function () use ($data) {
            $cita = ! empty($data['cita_id']) ? Appointment::with(['cliente', 'barbero'])->findOrFail($data['cita_id']) : null;

            $barbero = $cita?->barbero;

            if (! $barbero && ! empty($data['barbero_id'])) {
                $barbero = Barbero::findOrFail($data['barbero_id']);
            }

            if (! $barbero && ! $cita) {
                throw new \InvalidArgumentException('La venta requiere un barbero o una cita.');
            }

            $barberiaId = $cita?->barberia_id ?? $barbero?->barberia_id;

            $cliente = $this->resolveCliente($data, $barberiaId, $cita);

            $servicios = Servicio::whereIn('id', $data['servicios'] ?? [])->get()->keyBy('id');
            $productos = Producto::whereIn('id', collect($data['productos'] ?? [])->pluck('producto_id')->all())->get()->keyBy('id');

            $lines = [];
            $subtotal = 0.0;
            $utilidadNeta = 0.0;

            foreach ($data['servicios'] ?? [] as $servicioId) {
                /** @var Servicio|null $servicio */
                $servicio = $servicios->get($servicioId);

                if (! $servicio) {
                    continue;
                }

                $lineSubtotal = (float) $servicio->precio;

                $line = [
                    'tipo_item' => 'servicio',
                    'servicio_id' => $servicio->id,
                    'producto_id' => null,
                    'descripcion' => $servicio->nombre,
                    'cantidad' => 1,
                    'precio_venta' => (float) $servicio->precio,
                    'precio_costo' => 0,
                    'subtotal' => $lineSubtotal,
                    'utilidad_neta' => $lineSubtotal,
                ];

                $lines[] = $line;
                $subtotal += $line['subtotal'];
                $utilidadNeta += $line['utilidad_neta'];
            }

            foreach ($data['productos'] ?? [] as $productInput) {
                /** @var Producto|null $producto */
                $producto = $productos->get($productInput['producto_id']);

                if (! $producto) {
                    continue;
                }

                $cantidad = (int) $productInput['cantidad'];

                if ($producto->stock_actual < $cantidad) {
                    throw new \InvalidArgumentException("Stock insuficiente para {$producto->nombre}.");
                }

                $lineSubtotal = (float) $producto->precio_venta * $cantidad;
                $lineUtilidad = ((float) $producto->precio_venta - (float) $producto->precio_costo) * $cantidad;

                $line = [
                    'tipo_item' => 'producto',
                    'servicio_id' => null,
                    'producto_id' => $producto->id,
                    'descripcion' => $producto->nombre,
                    'cantidad' => $cantidad,
                    'precio_venta' => (float) $producto->precio_venta,
                    'precio_costo' => (float) $producto->precio_costo,
                    'subtotal' => $lineSubtotal,
                    'utilidad_neta' => $lineUtilidad,
                ];

                $lines[] = $line;
                $subtotal += $line['subtotal'];
                $utilidadNeta += $line['utilidad_neta'];
            }

            $venta = $this->ventaRepository->create([
                'barberia_id' => $barberiaId,
                'cita_id' => $cita?->id,
                'cliente_id' => $cliente?->id,
                'barbero_id' => $barbero?->id,
                'tipo_origen' => $cita ? 'cita' : 'mostrador',
                'estado' => 'pagada',
                'subtotal' => $subtotal,
                'descuento' => 0,
                'total' => $subtotal,
                'utilidad_neta' => $utilidadNeta,
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            foreach ($lines as $line) {
                /** @var VentaDetalle $detalle */
                $detalle = $venta->detalles()->create($line);

                if ($line['tipo_item'] === 'producto' && $line['producto_id']) {
                    /** @var Producto $producto */
                    $producto = $productos->get($line['producto_id']);
                    $stockAnterior = $producto->stock_actual;
                    $stockPosterior = $stockAnterior - $line['cantidad'];

                    $producto->update(['stock_actual' => $stockPosterior]);

                    InventarioMovimiento::create([
                        'producto_id' => $producto->id,
                        'venta_id' => $venta->id,
                        'venta_detalle_id' => $detalle->id,
                        'tipo' => 'venta',
                        'cantidad' => -1 * $line['cantidad'],
                        'stock_anterior' => $stockAnterior,
                        'stock_posterior' => $stockPosterior,
                        'observaciones' => 'Venta registrada desde la aplicación.',
                    ]);
                }
            }

            if ($cita) {
                $cita->update([
                    'total_pagado' => Venta::where('cita_id', $cita->id)
                        ->where('estado', 'pagada')
                        ->sum('total'),
                ]);
            }

            return $this->getById($venta->id) ?? $venta;
        });
    }

    protected function resolveCliente(array $data, string $barberiaId, ?Appointment $cita): ?Cliente
    {
        if ($cita?->cliente) {
            return $cita->cliente;
        }

        if (! empty($data['cliente_id'])) {
            return Cliente::findOrFail($data['cliente_id']);
        }

        if (empty($data['cliente_nombre']) && empty($data['cliente_email']) && empty($data['cliente_telefono'])) {
            return null;
        }

        if (! empty($data['cliente_email'])) {
            return Cliente::firstOrCreate(
                ['barberia_id' => $barberiaId, 'email' => $data['cliente_email']],
                ['nombre' => $data['cliente_nombre'] ?: 'Cliente mostrador', 'telefono' => $data['cliente_telefono'] ?? null],
            );
        }

        return Cliente::create([
            'barberia_id' => $barberiaId,
            'nombre' => $data['cliente_nombre'] ?: 'Cliente mostrador',
            'telefono' => $data['cliente_telefono'] ?? null,
            'email' => null,
        ]);
    }
}
