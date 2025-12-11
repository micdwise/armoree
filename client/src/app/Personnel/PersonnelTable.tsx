import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    SortableHead,
} from "@components/Table";
import { Card, CardContent } from "@components/Card";
import {
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from "@components/Layout";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Pagination } from "@components/Pagination";
import { Spinner } from "@components/Spinner";
import { Trash2, Search, AlertTriangle, Box } from "lucide-react";
import { Personnel } from "./PersonnelData";

export type SortBy = {
    index?: number;
    direction?: "asc" | "desc";
};

interface PersonnelTableProps {
    personnel: Personnel[];
    isLoading: boolean;
    isError: boolean;
    sortBy: SortBy;
    onSort: (event: React.MouseEvent, index: number, direction: "asc" | "desc") => void;
    itemCount: number;
    page: number;
    perPage: number;
    onSetPage: (event: any, page: number) => void;
    onPerPageSelect: (event: any, perPage: number, page: number) => void;
    filterValue: string;
    onFilterChange: (event: React.FormEvent<HTMLInputElement>, value: string) => void;
    onDeletePersonnel: (personnel: Personnel) => void;
    onViewTraining: (personnel: Personnel) => void;
}

export const PersonnelTable: React.FunctionComponent<PersonnelTableProps> = ({
    personnel,
    isLoading,
    isError,
    sortBy,
    onSort,
    itemCount,
    page,
    perPage,
    onSetPage,
    onPerPageSelect,
    filterValue,
    onFilterChange,
    onDeletePersonnel,
    onViewTraining,
}) => {
    const navigate = useNavigate();
    const columnNames = {
        badge_number: "Badge #",
        first_name: "First Name",
        last_name: "Last Name",
        unit: "Unit",
        status: "Status",
    };

    const columns = [
        { title: columnNames.badge_number, key: "badge_number" },
        { title: columnNames.first_name, key: "first_name" },
        { title: columnNames.last_name, key: "last_name" },
        { title: columnNames.unit, key: "unit" },
        { title: columnNames.status, key: "status" },
        { title: "", key: "actions" },
    ];

    const renderTableRows = () => {
        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-red-600">
                            <AlertTriangle className="h-8 w-8" />
                            <p>Error loading personnel data.</p>
                            <p className="text-sm text-subtext-color">
                                There was a problem loading your personnel list. Please try again later.
                            </p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (personnel.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                            {filterValue ? (
                                <>
                                    <Search className="h-8 w-8 opacity-50" />
                                    <p>No Results found</p>
                                    <p className="text-sm">
                                        No personnel match your current filter criteria.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Box className="h-8 w-8 opacity-0" />
                                    <p>No personnel found.</p>
                                    <p className="text-sm">
                                        Get started by adding personnel to your roster.
                                    </p>
                                </>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return personnel.map((person) => (
            <TableRow
                key={person.personnel_id}
                onClick={() => navigate(`/Personnel/${person.personnel_id}`)}
                className="cursor-pointer hover:bg-neutral-50"
            >
                <TableCell>{person.badge_number}</TableCell>
                <TableCell>{person.first_name}</TableCell>
                <TableCell>{person.last_name}</TableCell>
                <TableCell>{person.unit?.unit_name || "-"}</TableCell>
                <TableCell>{person.status}</TableCell>
                <TableCell>
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeletePersonnel(person);
                            }}
                            aria-label="Delete personnel"
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    const renderMobileContent = () => {
        if (isError) {
            return (
                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-red-600">
                    <AlertTriangle className="h-8 w-8" />
                    <p>Error loading personnel data</p>
                    <p className="text-sm text-subtext-color">
                        There was a problem loading your personnel list. Please try again later.
                    </p>
                </div>
            );
        }

        if (personnel.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-gray-500">
                    {filterValue ? (
                        <>
                            <Search className="h-8 w-8 opacity-50" />
                            <p>No Results found</p>
                            <p className="text-sm">
                                No personnel match your current filter criteria.
                            </p>
                        </>
                    ) : (
                        <>
                            <Box className="h-8 w-8 opacity-0" />
                            <p>No personnel found.</p>
                            <p className="text-sm">
                                Get started by adding personnel to your roster.
                            </p>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {personnel.map((person) => (
                    <div key={person.personnel_id} className="relative rounded-lg border border-neutral-border bg-default-background p-4 shadow-sm">
                        <div className="mb-2 flex items-start justify-between">
                            <div className="pr-8">
                                <h3 className="font-medium text-default-font">
                                    {person.first_name} {person.last_name}
                                </h3>
                                <p className="text-sm text-subtext-color">Badge: {person.badge_number}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm text-subtext-color">
                            <div className="flex justify-between">
                                <span>Unit:</span>
                                <span className="text-default-font">{person.unit?.unit_name || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="text-default-font">{person.status}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onViewTraining(person)}
                            >
                                Training
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onDeletePersonnel(person)}
                                aria-label="Delete personnel"
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center p-8">
                    <Spinner size="lg" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col gap-4">
                    <Toolbar>
                        <ToolbarContent>
                            <ToolbarItem className="w-full sm:w-72">
                                <Input
                                    placeholder="Filter personnel..."
                                    value={filterValue}
                                    onChange={(e) => onFilterChange(e, e.target.value)}
                                    startContent={<Search className="h-4 w-4" />}
                                />
                            </ToolbarItem>
                        </ToolbarContent>
                    </Toolbar>

                    <div className="lg:hidden">{renderMobileContent()}</div>

                    <div className="hidden rounded-md bg-default-background lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((column, columnIndex) =>
                                        column.title ? (
                                            <SortableHead
                                                key={column.key}
                                                sortDirection={
                                                    sortBy.index === columnIndex
                                                        ? sortBy.direction
                                                        : null
                                                }
                                                onSort={() =>
                                                    onSort(
                                                        null as any,
                                                        columnIndex,
                                                        sortBy.index === columnIndex &&
                                                            sortBy.direction === "asc"
                                                            ? "desc"
                                                            : "asc",
                                                    )
                                                }
                                            >
                                                {column.title}
                                            </SortableHead>
                                        ) : (
                                            <TableHead key={column.key} />
                                        )
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderTableRows()}
                            </TableBody>
                        </Table>
                    </div>

                    {!isError && itemCount > 0 && (
                        <div className="mt-4">
                            <Pagination
                                itemCount={itemCount}
                                perPage={perPage}
                                page={page}
                                onSetPage={(p) => onSetPage(null, p)}
                                onPerPageSelect={(pp) => onPerPageSelect(null, pp, 1)}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
