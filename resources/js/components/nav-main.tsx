import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

function hasActiveDescendant(item: NavItem, isCurrentUrl: (href: NavItem['href'], currentUrl?: string, startsWith?: boolean) => boolean): boolean {
    if (isCurrentUrl(item.href, undefined, true)) {
        return true;
    }

    return (item.submenu ?? []).some((child) => hasActiveDescendant(child, isCurrentUrl));
}

function renderNavItems(items: NavItem[], isCurrentUrl: (href: NavItem['href'], currentUrl?: string, startsWith?: boolean) => boolean, level: number = 0) {
    const isSubmenuLevel = level > 0;

    return items.map((item) => {
        const hasSubmenu = Boolean(item.submenu && item.submenu.length > 0);
        const active = isCurrentUrl(item.href, undefined, true);

        if (!hasSubmenu) {
            if (isSubmenuLevel) {
                return (
                    <SidebarMenuSubItem key={`${item.title}-${level}`}>
                        <SidebarMenuSubButton asChild isActive={active}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                );
            }

            return (
                <SidebarMenuItem key={`${item.title}-${level}`}>
                    <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={{ children: item.title }}
                    >
                        <Link href={item.href} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        }

        const defaultOpen = hasActiveDescendant(item, isCurrentUrl);

        if (isSubmenuLevel) {
            return (
                <SidebarMenuSubItem key={`${item.title}-${level}`}>
                    <Collapsible defaultOpen={defaultOpen}>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuSubButton>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="group/collapsible" data-state={defaultOpen ? 'open' : 'closed'}>
                            <SidebarMenuSub>
                                {renderNavItems(item.submenu ?? [], isCurrentUrl, level + 1)}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuSubItem>
            );
        }

        return (
            <SidebarMenuItem key={`${item.title}-${level}`}>
                <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={{ children: item.title }}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {renderNavItems(item.submenu ?? [], isCurrentUrl, level + 1)}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
        );
    });
}

export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            {items.map((group) => (
                <SidebarGroup className="px-2 py-0" key={group.title}>
                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {renderNavItems(group.items, isCurrentUrl)}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
