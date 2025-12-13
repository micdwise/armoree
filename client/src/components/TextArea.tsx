import * as React from 'react';
import { cn } from '../lib/utils';
import { Field } from '@base-ui-components/react/field';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <Field.Root className="w-full">
                <textarea
                    ref={ref}
                    className={cn(
                        'flex min-h-[80px] w-full rounded-xl border border-neutral-border bg-default-background px-3 py-2 text-sm text-default-font placeholder:text-subtext-color focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
            </Field.Root>
        );
    }
);

TextArea.displayName = 'TextArea';
