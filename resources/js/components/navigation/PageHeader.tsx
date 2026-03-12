import { router } from '@inertiajs/react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import type { RouteDefinition } from '@/wayfinder';

interface Props {
    title: string;
    description?: string;
    createRoute?: RouteDefinition<'get'>;
    createLabel?: string;
    backRoute?: RouteDefinition<'get'>;
}

export function PageHeader({ title, description, createRoute, createLabel = 'Crear', backRoute }: Props) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                {backRoute && (
                    <Button variant="ghost" size="sm" onClick={() => router.visit(backRoute.url)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                </div>
            </div>
            {createRoute && (
                <Button onClick={() => router.visit(createRoute.url)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {createLabel}
                </Button>
            )}
        </div>
    );
}
