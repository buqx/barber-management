import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DollarSign, Users, Calendar, ShoppingBag, TrendingUp, TrendingDown, AlertTriangle, Clock, Scissors, Palette } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { motion } from 'framer-motion';
import { FadeInUp, StaggerContainer, AnimatedListItem, HoverCard } from '@/components/animations';
import { AnimatedList } from '@/hooks/useAnimatedList';
import { useState, useEffect } from 'react';

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

// Animated bar chart component with gradient
function BarChart({ data, maxValue }: { data: Array<{ label: string; value: number }>; maxValue: number }) {
    return (
        <div className="flex items-end gap-1 h-40">
            {data.map((item, i) => (
                <motion.div
                    key={i}
                    className="flex-1 flex flex-col items-center group"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    style={{ originY: 1 }}
                >
                    <motion.div
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.value / maxValue) * 100}%` }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                        style={{ minHeight: item.value > 0 ? '4px' : '0' }}
                    />
                    <span className="text-[8px] mt-2 text-muted-foreground">{item.label}</span>
                </motion.div>
            ))}
        </div>
    );
}

// Animated progress bar with gradient
function ProgressBar({ value, max, color }: { value: number; max: number; color?: string }) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const colorMap: Record<string, string> = {
        'bg-blue-500': 'from-blue-600 to-blue-400',
        'bg-green-500': 'from-green-600 to-green-400',
        'bg-amber-500': 'from-amber-600 to-amber-400',
    };
    const gradientClass = colorMap[color || ''] || 'from-primary to-primary/60';

    return (
        <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden">
            <motion.div
                className={`h-full bg-gradient-to-r ${gradientClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </div>
    );
}

// Premium stat card with gradient accent
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    accent: accentColor = 'amber'
}: {
    title: string;
    value: React.ReactNode;
    subtitle?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    trendValue?: string;
    accent?: 'amber' | 'green' | 'blue' | 'rose';
}) {
    const accentClasses: Record<string, { icon: string; gradient: string; border: string }> = {
        amber: {
            icon: 'text-amber-600 dark:text-amber-400',
            gradient: 'from-amber-500/10 to-transparent',
            border: 'border-l-amber-500',
        },
        green: {
            icon: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-500/10 to-transparent',
            border: 'border-l-emerald-500',
        },
        blue: {
            icon: 'text-blue-600 dark:text-blue-400',
            gradient: 'from-blue-500/10 to-transparent',
            border: 'border-l-blue-500',
        },
        rose: {
            icon: 'text-rose-600 dark:text-rose-400',
            gradient: 'from-rose-500/10 to-transparent',
            border: 'border-l-rose-500',
        },
    };

    const selectedAccent = accentClasses[accentColor];

    return (
        <HoverCard>
            <Card className={`relative overflow-hidden border-l-4 ${selectedAccent.border} transition-all hover:shadow-md`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedAccent.gradient} pointer-events-none`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <Icon className={`h-5 w-5 ${selectedAccent.icon}`} />
                </CardHeader>
                <CardContent className="relative">
                    <motion.div
                        className="text-3xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {value}
                    </motion.div>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    )}
                    {trend && trendValue && (
                        <div className="flex items-center gap-1 text-xs mt-2">
                            {trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-rose-500" />
                            )}
                            <span className={trend === 'up' ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                                {trendValue}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </HoverCard>
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

    const ventasChartData = stats.ventas_ultimos_30_dias?.slice(-14).map(v => ({
        label: v.fecha,
        value: v.total,
    })) || [];

    const maxVentas = Math.max(...ventasChartData.map(d => d.value), 1);

    const serviciosTotal = stats.ventas_por_tipo?.find(v => v.tipo === 'Cita')?.total || 0;
    const productosTotal = stats.ventas_por_tipo?.find(v => v.tipo === 'Mostrador')?.total || 0;
    const totalTipo = serviciosTotal + productosTotal;

    if (is_global_admin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard - Admin Global" />
                <div className="p-6 space-y-6">
                    <FadeInUp>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                                <Palette className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                                <p className="text-muted-foreground">Resumen de todas las barberías</p>
                            </div>
                        </div>
                    </FadeInUp>

                    <StaggerContainer stagger={0.1}>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <AnimatedListItem>
                                <StatCard
                                    title="Barberías"
                                    value={stats.total_barberias || 0}
                                    icon={ShoppingBag}
                                    accent="amber"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Barberos"
                                    value={stats.total_barberos || 0}
                                    icon={Users}
                                    accent="blue"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Clientes"
                                    value={stats.total_clientes || 0}
                                    icon={Users}
                                    accent="green"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Ventas del Mes"
                                    value={formatCurrency(stats.ventas_mes || 0)}
                                    icon={DollarSign}
                                    accent="amber"
                                />
                            </AnimatedListItem>
                        </div>
                    </StaggerContainer>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-l-4 border-l-amber-500">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Calendar className="h-5 w-5 text-amber-600" />
                                <CardTitle>Citas Hoy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{stats.citas_hoy || 0}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <CardTitle>Transacciones Hoy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{stats.ventas_count_hoy || 0}</div>
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
            <div className="p-6 space-y-8">
                {/* Header */}
                <FadeInUp>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20">
                            <Scissors className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Bienvenido a tu Barbería</h1>
                            <p className="text-muted-foreground">Aquí está el resumen de hoy</p>
                        </div>
                    </div>
                </FadeInUp>

                {/* Stats Cards Row 1 - Financial */}
                <div>
                    <motion.h2
                        className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        Finanzas
                    </motion.h2>
                    <StaggerContainer stagger={0.08} delay={0.1}>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <AnimatedListItem>
                                <StatCard
                                    title="Ventas Hoy"
                                    value={formatCurrency(stats.ventas_hoy || 0)}
                                    subtitle={`${stats.ventas_count_hoy || 0} transacciones`}
                                    icon={DollarSign}
                                    accent="amber"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Esta Semana"
                                    value={formatCurrency(stats.ventas_semana || 0)}
                                    icon={TrendingUp}
                                    accent="blue"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Este Mes"
                                    value={formatCurrency(stats.ventas_mes || 0)}
                                    icon={Calendar}
                                    accent="amber"
                                    trend={stats.crecimiento_ventas !== undefined ? (stats.crecimiento_ventas >= 0 ? 'up' : 'down') : undefined}
                                    trendValue={`${stats.crecimiento_ventas?.toFixed(1) || 0}% vs mes anterior`}
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Utilidad Neta"
                                    value={formatCurrency(stats.utilidad_mes || 0)}
                                    icon={DollarSign}
                                    accent="green"
                                />
                            </AnimatedListItem>
                        </div>
                    </StaggerContainer>
                </div>

                {/* Stats Cards Row 2 - Operations */}
                <div>
                    <motion.h2
                        className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Operaciones
                    </motion.h2>
                    <StaggerContainer stagger={0.08} delay={0.4}>
                        <div className="grid gap-4 md:grid-cols-3">
                            <AnimatedListItem>
                                <StatCard
                                    title="Citas Hoy"
                                    value={stats.citas_hoy || 0}
                                    icon={Calendar}
                                    accent="blue"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Por Confirmar"
                                    value={stats.citas_pendientes || 0}
                                    icon={Clock}
                                    accent="rose"
                                />
                            </AnimatedListItem>
                            <AnimatedListItem>
                                <StatCard
                                    title="Clientes Total"
                                    value={stats.total_clientes || 0}
                                    icon={Users}
                                    accent="green"
                                />
                            </AnimatedListItem>
                        </div>
                    </StaggerContainer>
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    <FadeInUp delay={0.6}>
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">Tendencia de Ventas</CardTitle>
                                <span className="text-xs text-muted-foreground">Últimos 14 días</span>
                            </CardHeader>
                            <CardContent>
                                {ventasChartData.length > 0 ? (
                                    <BarChart data={ventasChartData} maxValue={maxVentas} />
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Sin datos disponibles</p>
                                )}
                            </CardContent>
                        </Card>
                    </FadeInUp>

                    <FadeInUp delay={0.7}>
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-base">Ventas por Canal</CardTitle>
                                <span className="text-xs text-muted-foreground">Este mes</span>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {totalTipo > 0 ? (
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                    <span className="text-sm font-medium">Citas</span>
                                                </span>
                                                <span className="font-semibold">{formatCurrency(serviciosTotal)}</span>
                                            </div>
                                            <ProgressBar value={serviciosTotal} max={totalTipo} color="bg-blue-500" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                                    <span className="text-sm font-medium">Mostrador</span>
                                                </span>
                                                <span className="font-semibold">{formatCurrency(productosTotal)}</span>
                                            </div>
                                            <ProgressBar value={productosTotal} max={totalTipo} color="bg-green-500" />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">Sin datos disponibles</p>
                                )}
                            </CardContent>
                        </Card>
                    </FadeInUp>
                </div>

                {/* Top items row */}
                <div className="grid gap-6 md:grid-cols-2">
                    <FadeInUp delay={0.8}>
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Scissors className="h-4 w-4 text-amber-600" />
                                    Servicios Populares
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">30 días</span>
                            </CardHeader>
                            <CardContent>
                                {stats.servicios_mas_vendidos && stats.servicios_mas_vendidos.length > 0 ? (
                                    <AnimatedList className="space-y-4">
                                        {stats.servicios_mas_vendidos.map((servicio, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{servicio.nombre}</p>
                                                        <p className="text-xs text-muted-foreground">{servicio.cantidad} servicios</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-amber-600">{formatCurrency(servicio.total)}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatedList>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">Sin datos disponibles</p>
                                )}
                            </CardContent>
                        </Card>
                    </FadeInUp>

                    <FadeInUp delay={0.9}>
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-green-600" />
                                    Productos Vendidos
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">30 días</span>
                            </CardHeader>
                            <CardContent>
                                {stats.productos_mas_vendidos && stats.productos_mas_vendidos.length > 0 ? (
                                    <AnimatedList className="space-y-4">
                                        {stats.productos_mas_vendidos.map((producto, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{producto.nombre}</p>
                                                        <p className="text-xs text-muted-foreground">{producto.cantidad} unidades</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-green-600">{formatCurrency(producto.total)}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatedList>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">Sin datos disponibles</p>
                                )}
                            </CardContent>
                        </Card>
                    </FadeInUp>
                </div>

                {/* Alerts and Recent sales */}
                <div className="grid gap-6 md:grid-cols-2">
                    <FadeInUp delay={1.0}>
                        <Card className={`overflow-hidden ${stats.productos_stock_bajo?.length || stats.productos_sin_stock ? 'border-amber-300 dark:border-amber-700' : 'border-green-300 dark:border-green-800'}`}>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className={`h-4 w-4 ${stats.productos_stock_bajo?.length || stats.productos_sin_stock ? 'text-amber-500' : 'text-green-500'}`} />
                                    Estado del Inventario
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.productos_sin_stock ? (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-3">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                            {stats.productos_sin_stock} productos sin stock
                                        </span>
                                    </div>
                                ) : null}
                                {stats.productos_stock_bajo && stats.productos_stock_bajo.length > 0 ? (
                                    <AnimatedList className="space-y-2">
                                        {stats.productos_stock_bajo.map((producto) => (
                                            <motion.div
                                                key={producto.id}
                                                className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/50"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <span>{producto.nombre}</span>
                                                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                                                    {producto.stock_actual} unidades
                                                </span>
                                            </motion.div>
                                        ))}
                                    </AnimatedList>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium">Inventario saludable</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </FadeInUp>

                    <FadeInUp delay={1.1}>
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-amber-600" />
                                    Ventas Recientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.ventas_recientes && stats.ventas_recientes.length > 0 ? (
                                    <AnimatedList className="space-y-3">
                                        {stats.ventas_recientes.map((venta) => (
                                            <motion.div
                                                key={venta.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <div>
                                                    <p className="font-medium">{venta.cliente?.nombre || 'Cliente mostrador'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {venta.barbero?.nombre} • {formatDate(venta.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-semibold">{formatCurrency(venta.total)}</span>
                                                    <p className="text-xs text-muted-foreground">
                                                        {venta.tipo_origen === 'cita' ? 'Cita' : 'Mostrador'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatedList>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No hay ventas recientes</p>
                                )}
                            </CardContent>
                        </Card>
                    </FadeInUp>
                </div>
            </div>
        </AppLayout>
    );
}
