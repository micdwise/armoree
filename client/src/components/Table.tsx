import * as React from 'react';
import { cn } from '../lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Simple table components matching HTML structure but styled

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="relative w-full overflow-auto">
            <table
                ref={ref}
                className={cn('w-full caption-bottom text-sm text-left', className)}
                {...props}
            />
        </div>
    )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
    )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    )
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn('border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50', className)}
            {...props}
        />
    )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={cn('h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0', className)}
            {...props}
        />
    )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0', className)}
            {...props}
        />
    )
);
TableCell.displayName = 'TableCell';

// Helper for sortable headers
interface SortableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
    sortDirection?: 'asc' | 'desc' | null;
    onSort?: () => void;
}

export const SortableHead = ({ children, sortDirection, onSort, className, ...props }: SortableHeadProps) => {
    return (
        <TableHead
            onClick={onSort}
            className={cn('cursor-pointer select-none hover:text-gray-700 group', className)}
            {...props}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortDirection === 'asc' && <ChevronUp className="h-3 w-3" />}
                {sortDirection === 'desc' && <ChevronDown className="h-3 w-3" />}
                {!sortDirection && <ChevronUp className="h-3 w-3 opacity-0 group-hover:opacity-50" />}
            </div>
        </TableHead>
    );
};
