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
import { Building, User, Scissors, Users, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
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
    {
        title: 'Citas',
        href: '/citas',
        icon: Calendar,
    },
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
    {
        title: 'Perfil',
        href: '/settings/profile',
        icon: LayoutGrid,
    },
    {
        title: 'Contrase\u00f1a',
        href: '/settings/password',
        icon: LayoutGrid,
    },
    {
        title: 'Apariencia',
        href: '/settings/appearance',
        icon: LayoutGrid,
    },
    {
        title: '2FA',
        href: '/settings/two-factor',
        icon: LayoutGrid,
    },
    {
        title: 'Login',
        href: '/auth/login',
        icon: LayoutGrid,
    },
    {
        title: 'Registro',
        href: '/auth/register',
        icon: LayoutGrid,
    },
    {
        title: 'Recuperar contrase\u00f1a',
        href: '/auth/forgot-password',
        icon: LayoutGrid,
    },
    {
        title: 'Verificar email',
        href: '/auth/verify-email',
        icon: LayoutGrid,
    },
    {
        title: 'Confirmar contrase\u00f1a',
        href: '/auth/confirm-password',
        icon: LayoutGrid,
    },
    {
        title: 'Desaf\u00edo 2FA',
        href: '/auth/two-factor-challenge',
        icon: LayoutGrid,
    },
    {
        title: 'Reset password',
        href: '/auth/reset-password',
        icon: LayoutGrid,
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
