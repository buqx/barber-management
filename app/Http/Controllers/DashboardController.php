<?php

namespace App\Http\Controllers;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\TurnoFijoRepositoryInterface;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Domain\Ventas\Gestion\Models\Venta;
use App\Domain\Ventas\Gestion\Models\VentaDetalle;
use App\Domain\Catalogo\Productos\Models\Producto;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Shared\Tenancy\TenantScope;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use TenantScope;

    public function index(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();
        $isGlobalAdmin = $this->isGlobalAdmin();

        // Si es admin global, obtener stats generales
        if ($isGlobalAdmin) {
            return $this->getGlobalStats();
        }

        if (!$barberiaId) {
            return Inertia::render('dashboard', [
                'stats' => null,
            ]);
        }

        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Ventas
        $ventasHoy = Venta::where('barberia_id', $barberiaId)
            ->whereDate('created_at', $today)
            ->where('estado', 'pagada')
            ->sum('total');

        $ventasSemana = Venta::where('barberia_id', $barberiaId)
            ->whereBetween('created_at', [$startOfWeek, now()])
            ->where('estado', 'pagada')
            ->sum('total');

        $ventasMes = Venta::where('barberia_id', $barberiaId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('estado', 'pagada')
            ->sum('total');

        $ventasMesPasado = Venta::where('barberia_id', $barberiaId)
            ->whereBetween('created_at', [
                $startOfMonth->copy()->subMonth(),
                $endOfMonth->copy()->subMonth(),
            ])
            ->where('estado', 'pagada')
            ->sum('total');

        $ventasCountHoy = Venta::where('barberia_id', $barberiaId)
            ->whereDate('created_at', $today)
            ->where('estado', 'pagada')
            ->count();

        // Citas
        $citasHoy = Appointment::where('barberia_id', $barberiaId)
            ->whereDate('inicio_at', $today)
            ->count();

        $citasPendientes = Appointment::where('barberia_id', $barberiaId)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->count();

        // Clientes
        $totalClientes = Cliente::where('barberia_id', $barberiaId)->count();

        // Productos con stock bajo (menos de 5 unidades)
        $productosStockBajo = Producto::where('barberia_id', $barberiaId)
            ->where('stock_actual', '<', 5)
            ->where('stock_actual', '>', 0)
            ->orderBy('stock_actual')
            ->limit(10)
            ->get();

        $productosSinStock = Producto::where('barberia_id', $barberiaId)
            ->where('stock_actual', '<=', 0)
            ->count();

        // Gráfico de ventas últimos 30 días
        $ventasUltimos30Dias = Venta::where('barberia_id', $barberiaId)
            ->where('created_at', '>=', now()->subDays(30))
            ->where('estado', 'pagada')
            ->select(DB::raw('DATE(created_at) as fecha'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as cantidad'))
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get()
            ->map(function ($item) {
                return [
                    'fecha' => Carbon::parse($item->fecha)->format('d/m'),
                    'total' => (float) $item->total,
                    'cantidad' => $item->cantidad,
                ];
            });

        // Servicios más vendidos (últimos 30 días)
        $serviciosMasVendidos = VentaDetalle::whereHas('venta', function ($query) use ($barberiaId) {
                $query->where('barberia_id', $barberiaId)
                    ->where('estado', 'pagada')
                    ->where('created_at', '>=', now()->subDays(30));
            })
            ->where('tipo_item', 'servicio')
            ->select('servicio_id', DB::raw('SUM(cantidad) as cantidad'), DB::raw('SUM(subtotal) as total'))
            ->groupBy('servicio_id')
            ->orderByDesc('cantidad')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $servicio = Servicio::find($item->servicio_id);
                return [
                    'nombre' => $servicio?->nombre ?? 'Servicio eliminado',
                    'cantidad' => $item->cantidad,
                    'total' => (float) $item->total,
                ];
            });

        // Productos más vendidos (últimos 30 días)
        $productosMasVendidos = VentaDetalle::whereHas('venta', function ($query) use ($barberiaId) {
                $query->where('barberia_id', $barberiaId)
                    ->where('estado', 'pagada')
                    ->where('created_at', '>=', now()->subDays(30));
            })
            ->where('tipo_item', 'producto')
            ->select('producto_id', DB::raw('SUM(cantidad) as cantidad'), DB::raw('SUM(subtotal) as total'))
            ->groupBy('producto_id')
            ->orderByDesc('cantidad')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $producto = Producto::find($item->producto_id);
                return [
                    'nombre' => $producto?->nombre ?? 'Producto eliminado',
                    'cantidad' => $item->cantidad,
                    'total' => (float) $item->total,
                ];
            });

        // Ventas por tipo (cita vs mostrador)
        $ventasPorTipo = Venta::where('barberia_id', $barberiaId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('estado', 'pagada')
            ->select('tipo_origen', DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as cantidad'))
            ->groupBy('tipo_origen')
            ->get()
            ->map(function ($item) {
                return [
                    'tipo' => $item->tipo_origen === 'cita' ? 'Cita' : 'Mostrador',
                    'total' => (float) $item->total,
                    'cantidad' => $item->cantidad,
                ];
            });

        // Utilidad del mes
        $utilidadMes = Venta::where('barberia_id', $barberiaId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('estado', 'pagada')
            ->sum('utilidad_neta');

        // Ventas recientes
        $ventasRecientes = Venta::where('barberia_id', $barberiaId)
            ->where('estado', 'pagada')
            ->with(['cliente', 'barbero'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Calcular crecimiento
        $crecimientoVentas = $ventasMesPasado > 0
            ? (($ventasMes - $ventasMesPasado) / $ventasMesPasado) * 100
            : 0;

        return Inertia::render('dashboard', [
            'stats' => [
                'ventas_hoy' => (float) $ventasHoy,
                'ventas_semana' => (float) $ventasSemana,
                'ventas_mes' => (float) $ventasMes,
                'ventas_count_hoy' => $ventasCountHoy,
                'citas_hoy' => $citasHoy,
                'citas_pendientes' => $citasPendientes,
                'total_clientes' => $totalClientes,
                'productos_stock_bajo' => $productosStockBajo,
                'productos_sin_stock' => $productosSinStock,
                'utilidad_mes' => (float) $utilidadMes,
                'crecimiento_ventas' => round($crecimientoVentas, 1),
                'ventas_ultimos_30_dias' => $ventasUltimos30Dias,
                'servicios_mas_vendidos' => $serviciosMasVendidos,
                'productos_mas_vendidos' => $productosMasVendidos,
                'ventas_por_tipo' => $ventasPorTipo,
                'ventas_recientes' => $ventasRecientes,
            ],
            'is_global_admin' => $isGlobalAdmin,
        ]);
    }

    private function getGlobalStats()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $totalBarberias = Barberia::count();
        $totalBarberos = Barbero::count();
        $totalClientes = Cliente::count();

        $ventasMes = Venta::where('estado', 'pagada')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('total');

        $ventasCountHoy = Venta::where('estado', 'pagada')
            ->whereDate('created_at', $today)
            ->count();

        $citasHoy = Appointment::whereDate('inicio_at', $today)->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_barberias' => $totalBarberias,
                'total_barberos' => $totalBarberos,
                'total_clientes' => $totalClientes,
                'ventas_mes' => (float) $ventasMes,
                'ventas_count_hoy' => $ventasCountHoy,
                'citas_hoy' => $citasHoy,
            ],
            'is_global_admin' => true,
        ]);
    }
}
