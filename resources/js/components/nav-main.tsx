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
import { motion } from 'framer-motion';
import { StaggerContainer, AnimatedListItem } from '@/components/animations';

function hasActiveDescendant(item: NavItem, isCurrentUrl: (href: NavItem['href'], currentUrl?: string, startsWith?: boolean) => boolean): boolean {
    if (isCurrentUrl(item.href, undefined, true)) {
        return true;
    }

    return (item.submenu ?? []).some((child) => hasActiveDescendant(child, isCurrentUrl));
}

function renderNavItems(
    items: NavItem[],
    isCurrentUrl: (href: NavItem['href'], currentUrl?: string, startsWith?: boolean) => boolean,
    level: number = 0
) {
    const isSubmenuLevel = level > 0;

    return items.map((item, index) => {
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
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                    >
                        <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={{ children: item.title }}
                            className="transition-all duration-200 hover:bg-accent"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </motion.div>
                </SidebarMenuItem>
            );
        }

        const defaultOpen = hasActiveDescendant(item, isCurrentUrl);

        if (isSubmenuLevel) {
            return (
                <SidebarMenuSubItem key={`${item.title}-${level}`}>
                    <Collapsible defaultOpen={defaultOpen}>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuSubButton className="transition-colors duration-200 hover:bg-accent">
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                        <SidebarMenuButton
                            tooltip={{ children: item.title }}
                            className="transition-colors duration-200 hover:bg-accent"
                        >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
            {items.map((group, groupIndex) => (
                <SidebarGroup className="px-2 py-0" key={group.title}>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                    >
                        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                            {group.title}
                        </SidebarGroupLabel>
                    </motion.div>
                    <SidebarMenu>
                        <StaggerContainer stagger={0.05} delay={groupIndex * 0.1}>
                            {renderNavItems(group.items, isCurrentUrl).map((item, index) => (
                                <AnimatedListItem key={item.key as string}>
                                    {item}
                                </AnimatedListItem>
                            ))}
                        </StaggerContainer>
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
