import * as React from 'react';
import { cn } from '../lib/utils';

export const PageSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <section className={cn('p-6', className)}>
            {children}
        </section>
    );
};

export const Toolbar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    );
};

export const ToolbarContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex items-center gap-4 w-full">{children}</div>;
};

export const ToolbarItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={className}>{children}</div>;
};

export const Title = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <h1 className={cn('text-2xl font-bold tracking-tight', className)}>{children}</h1>;
};
