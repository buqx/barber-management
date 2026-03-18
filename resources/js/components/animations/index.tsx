'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Fade in animations
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
};

// Scale animations
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

// Slide from right (for sheets/sidebars)
export const slideInRight: Variants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
};

// Stagger children for lists
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const staggerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

// Card hover effect
export const cardHover: Variants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
};

// Button press effect
export const buttonTap: Variants = {
    rest: { scale: 1 },
    tap: { scale: 0.95 },
};

// Animation props interfaces
interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    as?: 'div' | 'section' | 'article';
}

interface StaggerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    stagger?: number;
}

// Simple FadeIn component
export function FadeIn({ children, className = '', delay = 0, duration = 0.5, as: Component = 'div' }: FadeInProps) {
    return (
        <Component
            className={className}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay, duration }}
        >
            {children}
        </Component>
    );
}

// FadeInUp component
export function FadeInUp({ children, className = '', delay = 0, duration = 0.5, as: Component = 'div' }: FadeInProps) {
    return (
        <Component
            className={className}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay, duration, ease: 'easeOut' }}
        >
            {children}
        </Component>
    );
}

// FadeInDown component
export function FadeInDown({ children, className = '', delay = 0, duration = 0.5, as: Component = 'div' }: FadeInProps) {
    return (
        <Component
            className={className}
            initial="hidden"
            animate="visible"
            variants={fadeInDown}
            transition={{ delay, duration, ease: 'easeOut' }}
        >
            {children}
        </Component>
    );
}

// StaggerContainer for lists
export function StaggerContainer({ children, className = '', delay = 0, stagger = 0.1 }: StaggerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: stagger,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

// Animated number counter
interface CounterProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    duration?: number;
    decimals?: number;
}

export function Counter({ value, className = '', prefix = '', suffix = '', duration = 1, decimals = 0 }: CounterProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {prefix}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {value.toLocaleString('es-CO', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                })}
            </motion.span>
            {suffix}
        </motion.span>
    );
}

// ScaleIn for modals/dialogs
export function ScaleIn({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}

// HoverCard wrapper
export function HoverCard({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardHover}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

// Animated list item (for use inside StaggerContainer)
export const listItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export function AnimatedListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div className={className} variants={listItem}>
            {children}
        </motion.div>
    );
}

// AnimatePresence wrapper for conditional rendering
export function AnimatedSwitch({ children, mode = 'wait' }: { children: ReactNode; mode?: 'wait' | 'popLayout' | 'sync' }) {
    return (
        <AnimatePresence mode={mode}>
            {children}
        </AnimatePresence>
    );
}

export { motion, AnimatePresence };
