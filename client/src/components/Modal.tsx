import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
}: ModalProps) {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <BaseDialog.Root open={isOpen} onOpenChange={onClose}>
            <BaseDialog.Portal>
                <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />
                <BaseDialog.Popup
                    className={cn(
                        'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 animate-in fade-in-0 sm:rounded-lg',
                        sizes[size]
                    )}
                >
                    <div className="flex flex-col gap-1.5 text-center sm:text-left">
                        {title && (
                            <BaseDialog.Title className="text-lg font-semibold leading-none tracking-tight">
                                {title}
                            </BaseDialog.Title>
                        )}
                        {description && (
                            <BaseDialog.Description className="text-sm text-gray-500">
                                {description}
                            </BaseDialog.Description>
                        )}
                    </div>
                    <BaseDialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </BaseDialog.Close>

                    <div className="py-4">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            {footer}
                        </div>
                    )}
                </BaseDialog.Popup>
            </BaseDialog.Portal>
        </BaseDialog.Root>
    );
}
