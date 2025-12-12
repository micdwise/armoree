import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface FilterFeedbackProps {
    filterValue: string;
    onClear?: () => void;
    label?: string;
}

export const FilterFeedback: React.FC<FilterFeedbackProps> = ({
    filterValue,
    onClear,
    label = "keyword",
}) => {
    if (!filterValue) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-subtext-color">
            <span>
                Filtering by {label}: <span className="font-medium text-default-font">"{filterValue}"</span>
            </span>
            {onClear && (
                <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-subtext-color hover:text-default-font hover:no-underline"
                    onClick={onClear}
                    aria-label="Clear filter"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
};
