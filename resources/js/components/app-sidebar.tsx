const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import { Building, User, Scissors, Users, Calendar, CalendarDays, DollarSign, ShoppingBag, Settings } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup, NavItem } from '@/types';

const navigationItems: NavGroup[] = [
    {
        title: 'Dashboard',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Operación',
        items: [
            {
                title: 'Agenda y Citas',
                href: '/agenda',
                icon: CalendarDays,
                submenu: [
                    {
                        title: 'Agenda',
                        href: '/agenda',
                        icon: CalendarDays,
                    },
                    {
                        title: 'Citas',
                        href: '/citas',
                        icon: Calendar,
                    },
                ],
            },
            {
                title: 'Ventas',
                href: '/ventas',
                icon: DollarSign,
                submenu: [
                    {
                        title: 'Ventas',
                        href: '/ventas',
                        icon: DollarSign,
                    },
                    {
                        title: 'Productos',
                        href: '/productos',
                        icon: ShoppingBag,
                    },
                ],
            },
        ],
    },
    {
        title: 'Administración',
        items: [
            {
                title: 'Catálogos',
                href: '/barberias',
                icon: Building,
                submenu: [
                    {
                        title: 'Barberías',
                        href: '/barberias',
                        icon: Building,
                    },
                    {
                        title: 'Barberos',
                        href: '/barberos',
                        icon: User,
                    },
                    {
                        title: 'Servicios',
                        href: '/servicios',
                        icon: Scissors,
                    },
                    {
                        title: 'Clientes',
                        href: '/clientes',
                        icon: Users,
                    },
                ],
            },
        ],
    },
    {
        title: 'Configuración',
        items: [
            {
                title: 'Mi cuenta',
                href: '/settings/profile',
                icon: Settings,
                submenu: [
                    {
                        title: 'Perfil',
                        href: '/settings/profile',
                        icon: Settings,
                    },
                    {
                        title: 'Contraseña',
                        href: '/settings/password',
                        icon: Settings,
                    },
                    {
                        title: 'Apariencia',
                        href: '/settings/appearance',
                        icon: Settings,
                    },
                    {
                        title: '2FA',
                        href: '/settings/two-factor',
                        icon: Settings,
                    },
                ],
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
