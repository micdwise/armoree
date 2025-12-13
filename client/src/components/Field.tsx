import * as React from 'react';
import { Field as BaseField } from '@base-ui-components/react/field';
import { cn } from '../lib/utils';
import { AlertCircle } from 'lucide-react';

interface FieldProps {
    children: React.ReactNode;
    className?: string;
    error?: string | boolean; // Error message or simple boolean
    label?: string;
    id?: string; // fieldId
    required?: boolean;
}

export const Field = ({ children, className, error, label, id, required }: FieldProps) => {
    return (
        <BaseField.Root className={cn('flex flex-col gap-2', className)}>
            {label && (
                <BaseField.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label} {required && <span className="text-text-error">*</span>}
                </BaseField.Label>
            )}
            {children}
            {/* We can render error here if it's a string, or just support Field.Error child usage */}
            {typeof error === 'string' && (
                <BaseField.Error className="text-[0.8rem] font-medium text-text-error flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </BaseField.Error>
            )}
        </BaseField.Root>
    );
};
