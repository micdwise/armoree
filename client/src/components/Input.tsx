import * as React from 'react';
import { Input as BaseInput } from '@base-ui-components/react/input';
import { cn } from '../lib/utils';
import { Field } from '@base-ui-components/react/field';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    startContent?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, startContent, ...props }, ref) => {
        return (
            <Field.Root className="w-full">
                <div className="relative">
                    {startContent && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext-color">
                            {startContent}
                        </div>
                    )}
                    <BaseInput
                        ref={ref}
                        className={cn(
                            'flex h-10 w-full rounded-md border border-neutral-border bg-default-background py-2 text-sm text-default-font placeholder:text-subtext-color focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                            startContent ? 'pl-10 pr-3' : 'px-3',
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )}
                        {...props}
                    />
                </div>
            </Field.Root>
        );
    }
);

Input.displayName = 'Input';
