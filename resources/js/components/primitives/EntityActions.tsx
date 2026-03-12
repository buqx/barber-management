import { router } from '@inertiajs/react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import type { RouteDefinition } from '@/wayfinder';

interface Props {
    showRoute?: RouteDefinition<'get'>;
    editRoute?: RouteDefinition<'get'>;
    deleteRoute: RouteDefinition<'delete'>;
    onDelete?: () => void;
    size?: 'sm' | 'default';
}

export function EntityActions({ showRoute, editRoute, deleteRoute, onDelete, size = 'sm' }: Props) {
    function handleDelete() {
        if (onDelete) {
            onDelete();
            return;
        }
        if (confirm('¿Seguro que deseas eliminar este registro?')) {
            router.visit(deleteRoute.url, { method: 'delete' });
        }
    }

    return (
        <div className="flex items-center gap-2">
            {showRoute && (
                <Button variant="ghost" size={size} onClick={() => router.visit(showRoute.url)}>
                    <Eye className="h-4 w-4" />
                </Button>
            )}
            {editRoute && (
                <Button variant="ghost" size={size} onClick={() => router.visit(editRoute.url)}>
                    <Edit className="h-4 w-4" />
                </Button>
            )}
            <Button variant="ghost" size={size} className="text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
