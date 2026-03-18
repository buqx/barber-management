import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DollarSign, Users, Calendar, ShoppingBag, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

interface Stats {
    ventas_hoy?: number;
    ventas_semana?: number;
    ventas_mes?: number;
    ventas_count_hoy?: number;
    citas_hoy?: number;
    citas_pendientes?: number;
    total_clientes?: number;
    productos_stock_bajo?: Array<{
        id: string;
        nombre: string;
        stock_actual: number;
    }>;
    productos_sin_stock?: number;
    utilidad_mes?: number;
    crecimiento_ventas?: number;
    ventas_ultimos_30_dias?: Array<{
        fecha: string;
        total: number;
        cantidad: number;
    }>;
    servicios_mas_vendidos?: Array<{
        nombre: string;
        cantidad: number;
        total: number;
    }>;
    productos_mas_vendidos?: Array<{
        nombre: string;
        cantidad: number;
        total: number;
    }>;
    ventas_por_tipo?: Array<{
        tipo: string;
        total: number;
        cantidad: number;
    }>;
    ventas_recientes?: Array<{
        id: string;
        total: number;
        tipo_origen: string;
        created_at: string;
        cliente?: { nombre: string };
        barbero?: { nombre: string };
    }>;
    // Global admin stats
    total_barberias?: number;
    total_barberos?: number;
}

interface Props {
    stats: Stats | null;
    is_global_admin?: boolean;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(value);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Simple bar chart component
function BarChart({ data, maxValue }: { data: Array<{ label: string; value: number }>; maxValue: number }) {
    return (
        <div className="flex items-end gap-1 h-32">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: item.value > 0 ? '4px' : '0' }}
                    />
                    <span className="text-[8px] mt-1 text-muted-foreground">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

// Simple progress bar
function ProgressBar({ value, max, color }: { value: number; max: number; color?: string }) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
                className={`h-full ${color || 'bg-primary'}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export default function Dashboard({ stats, is_global_admin }: Props) {
    if (!stats) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="p-6">
                    <p className="text-muted-foreground">No tienes acceso a las estadísticas.</p>
                </div>
            </AppLayout>
        );
    }

    // Process data for charts
    const ventasChartData = stats.ventas_ultimos_30_dias?.slice(-14).map(v => ({
        label: v.fecha,
        value: v.total,
    })) || [];

    const maxVentas = Math.max(...ventasChartData.map(d => d.value), 1);

    // Calculate totals for servicios vs productos
    const serviciosTotal = stats.ventas_por_tipo?.find(v => v.tipo === 'Cita')?.total || 0;
    const productosTotal = stats.ventas_por_tipo?.find(v => v.tipo === 'Mostrador')?.total || 0;
    const totalTipo = serviciosTotal + productosTotal;

    if (is_global_admin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard - Admin Global" />
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold">Dashboard - Admin Global</h1>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Barberías</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_barberias || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Barberos</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_barberos || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_clientes || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.ventas_mes || 0)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Citas Hoy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.citas_hoy || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Ventas Hoy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.ventas_count_hoy || 0}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.ventas_hoy || 0)}</div>
                            <p className="text-xs text-muted-foreground">{stats.ventas_count_hoy || 0} transacciones</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas de la Semana</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.ventas_semana || 0)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.ventas_mes || 0)}</div>
                            <div className="flex items-center gap-1 text-xs">
                                {stats.crecimiento_ventas && stats.crecimiento_ventas >= 0 ? (
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={stats.crecimiento_ventas && stats.crecimiento_ventas >= 0 ? 'text-green-500' : 'text-red-500'}>
                                    {stats.crecimiento_ventas?.toFixed(1) || 0}%
                                </span>
                                <span className="text-muted-foreground">vs mes pasado</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Utilidad del Mes</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.utilidad_mes || 0)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Second row - Citas and Clients */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.citas_hoy || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.citas_pendientes || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_clientes || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Ventas Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ventas últimos 14 días</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ventasChartData.length > 0 ? (
                                <BarChart data={ventasChartData} maxValue={maxVentas} />
                            ) : (
                                <p className="text-muted-foreground text-center py-8">Sin datos</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ventas por tipo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ventas por Tipo (Mes)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {totalTipo > 0 ? (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded bg-blue-500" />
                                                Citas
                                            </span>
                                            <span className="font-medium">{formatCurrency(serviciosTotal)}</span>
                                        </div>
                                        <ProgressBar value={serviciosTotal} max={totalTipo} color="bg-blue-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded bg-green-500" />
                                                Mostrador
                                            </span>
                                            <span className="font-medium">{formatCurrency(productosTotal)}</span>
                                        </div>
                                        <ProgressBar value={productosTotal} max={totalTipo} color="bg-green-500" />
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">Sin datos</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Third row - Top items and Recent sales */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Servicios más vendidos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Servicios más vendidos (30 días)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.servicios_mas_vendidos && stats.servicios_mas_vendidos.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.servicios_mas_vendidos.map((servicio, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{servicio.nombre}</p>
                                                <p className="text-sm text-muted-foreground">{servicio.cantidad} ventas</p>
                                            </div>
                                            <span className="font-medium">{formatCurrency(servicio.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Sin datos</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Productos más vendidos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Productos más vendidos (30 días)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.productos_mas_vendidos && stats.productos_mas_vendidos.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.productos_mas_vendidos.map((producto, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{producto.nombre}</p>
                                                <p className="text-sm text-muted-foreground">{producto.cantidad} ventas</p>
                                            </div>
                                            <span className="font-medium">{formatCurrency(producto.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Sin datos</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Stock alerts and Recent sales */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Stock alerts */}
                    <Card className={stats.productos_stock_bajo?.length || stats.productos_sin_stock ? 'border-amber-200' : ''}>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Alertas de Inventario
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.productos_sin_stock ? (
                                <p className="text-red-500 font-medium mb-2">{stats.productos_sin_stock} productos sin stock</p>
                            ) : null}
                            {stats.productos_stock_bajo && stats.productos_stock_bajo.length > 0 ? (
                                <div className="space-y-2">
                                    {stats.productos_stock_bajo.map((producto) => (
                                        <div key={producto.id} className="flex justify-between items-center text-sm">
                                            <span>{producto.nombre}</span>
                                            <span className="text-amber-500 font-medium">{producto.stock_actual} unidades</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Inventario OK</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent sales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ventas Recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.ventas_recientes && stats.ventas_recientes.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.ventas_recientes.map((venta) => (
                                        <div key={venta.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{venta.cliente?.nombre || 'Cliente mostrador'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {venta.barbero?.nombre} • {formatDate(venta.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-medium">{formatCurrency(venta.total)}</span>
                                                <p className="text-xs text-muted-foreground">
                                                    {venta.tipo_origen === 'cita' ? 'Cita' : 'Mostrador'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Sin ventas recientes</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
