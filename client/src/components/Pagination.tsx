import * as React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select } from './Select';

interface PaginationProps {
    page: number;
    perPage: number;
    itemCount: number;
    onSetPage: (page: number) => void;
    onPerPageSelect: (perPage: number) => void;
}

export const Pagination = ({ page, perPage, itemCount, onSetPage, onPerPageSelect }: PaginationProps) => {
    const totalPages = Math.ceil(itemCount / perPage);
    const startItem = (page - 1) * perPage + 1;
    const endItem = Math.min(page * perPage, itemCount);

    const perPageOptions = [
        { value: '10', label: '10 per page' },
        { value: '20', label: '20 per page' },
        { value: '50', label: '50 per page' },
        { value: '100', label: '100 per page' },
    ];

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <Select
                    value={String(perPage)}
                    onChange={(val) => onPerPageSelect(Number(val))}
                    options={perPageOptions}
                    className="w-32"
                />
                <span>
                    {startItem} - {endItem} of {itemCount}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSetPage(1)}
                    disabled={page === 1}
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSetPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSetPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSetPage(totalPages)}
                    disabled={page === totalPages}
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
