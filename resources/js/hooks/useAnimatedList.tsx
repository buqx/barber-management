'use client';

import type { ReactNode } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface UseAnimatedListOptions {
    duration?: number;
    easing?: [number, number, number, number];
    skip?: boolean;
}

/**
 * Hook para usar auto-animate en listas
 * Uso: const [parent] = useAnimatedList()
 */
export function useAnimatedList(options?: UseAnimatedListOptions) {
    const [parent] = useAutoAnimate({
        duration: options?.duration,
        easing: options?.easing,
        skip: options?.skip,
    });

    return parent;
}

/**
 * Componente wrapper para listas animadas
 */
export function AnimatedList({
    children,
    className,
    as: Component = 'div',
    ...options
}: {
    children: ReactNode;
    className?: string;
    as?: 'div' | 'ul' | 'ol';
    duration?: number;
    easing?: [number, number, number, number];
    skip?: boolean;
}) {
    const [ref] = useAutoAnimate(options);

    return (
        <Component ref={ref} className={className}>
            {children}
        </Component>
    );
}
