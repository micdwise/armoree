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
    id?: string;
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
    id,
}: Readonly<SelectProps<T>>) {
    return (
        <BaseSelect.Root
            value={value ?? null}
            defaultValue={defaultValue}
            onValueChange={(val) => onChange?.(val as T)}
            disabled={disabled}
        >
            <BaseSelect.Trigger
                id={id}
                className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-neutral-border bg-default-background px-3 py-2 text-sm text-default-font placeholder:text-subtext-color focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
            >
                <BaseSelect.Value>
                    {(val) => {
                        const selectedOption = options.find((opt) => opt.value === val);
                        return selectedOption ? (
                            selectedOption.label
                        ) : (
                            <span className="text-subtext-color">{placeholder}</span>
                        );
                    }}
                </BaseSelect.Value>
                <BaseSelect.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </BaseSelect.Icon>
            </BaseSelect.Trigger>
            <BaseSelect.Portal>
                <BaseSelect.Positioner sideOffset={5} className="z-[9999]">
                    <BaseSelect.Popup className="min-w-[8rem] rounded-md border border-neutral-border bg-default-background shadow-xl p-1 max-h-60 overflow-auto">
                        {options.map((option) => (
                            <BaseSelect.Item
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className={cn(
                                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-screen-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-default-font'
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
