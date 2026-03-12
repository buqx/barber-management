import { usePage } from '@inertiajs/react';

type Role = 'owner' | 'admin' | 'barber';

interface Auth {
    user?: {
        id: string;
        roles?: Role[];
    };
}

export function usePermissions() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const roles: Role[] = auth?.user?.roles ?? [];

    return {
        isOwner: roles.includes('owner'),
        isAdmin: roles.includes('admin') || roles.includes('owner'),
        isBarber: roles.includes('barber'),
        can: (role: Role) => roles.includes(role),
    };
}
