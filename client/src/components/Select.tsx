import * as React from 'react';
import { Select as BaseSelect } from '@base-ui-components/react/select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface SelectProps<T extends string = string> {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    options: { value: T; label: string; disabled?: boolean }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: boolean;
}

export function Select<T extends string = string>({
    value,
    defaultValue,
    onChange,
    options,
    placeholder = 'Select an option',
    disabled,
    className,
    error,
}: SelectProps<T>) {
    return (
        <BaseSelect.Root
            value={value ?? null}
            defaultValue={defaultValue}
            onValueChange={(val) => onChange?.(val as T)}
            disabled={disabled}
        >
            <BaseSelect.Trigger
                className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
            >
                <BaseSelect.Value>
                    {(val) => (val ? val.label : <span className="text-gray-400">{placeholder}</span>)}
                </BaseSelect.Value>
                <BaseSelect.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </BaseSelect.Icon>
            </BaseSelect.Trigger>
            <BaseSelect.Portal>
                <BaseSelect.Positioner sideOffset={5}>
                    <BaseSelect.Popup className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md animate-in fade-in-80">
                        {options.map((option) => (
                            <BaseSelect.Item
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className={cn(
                                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                )}
                            >
                                <BaseSelect.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </BaseSelect.ItemIndicator>
                                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                            </BaseSelect.Item>
                        ))}
                    </BaseSelect.Popup>
                </BaseSelect.Positioner>
            </BaseSelect.Portal>
        </BaseSelect.Root>
    );
}
