import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableHead,
} from "@components/Table";
import { Card, CardContent } from "@components/Card";
import { Firearm } from "@app/Firearms/FirearmsData";
import {
  PageSection,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@components/Layout";
import { Spinner } from "@components/Spinner";

import { Pagination } from "@components/Pagination";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { FilterFeedback } from "@components/FilterFeedback";
import { Search, Box, Trash2, AlertTriangle } from "lucide-react";

export interface SortBy {
  index?: number;
  direction?: "asc" | "desc";
}

interface FirearmsTableProps {
  firearms: Firearm[];
  isLoading: boolean;
  isError: boolean;
  sortBy: SortBy;
  onSort: (
    event: React.MouseEvent,
    index: number,
    direction: "asc" | "desc",
  ) => void;
  itemCount: number;
  page: number;
  perPage: number;
  onSetPage: (event: any, newPage: number) => void;
  onPerPageSelect: (event: any, newPerPage: number, newPage: number) => void;
  onDeleteFirearm: (firearm: Firearm) => void;
  filterValue: string;
  onFilterChange: (
    event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => void;
  dashboardFilterLabel?: string;
  onClearDashboardFilter?: () => void;
}

const FirearmsTable: React.FunctionComponent<FirearmsTableProps> = ({
  firearms,
  isLoading,
  isError,
  sortBy,
  onSort,
  itemCount,
  page,
  perPage,
  onSetPage,
  onPerPageSelect,
  onDeleteFirearm,
  filterValue,
  onFilterChange,
  dashboardFilterLabel,
  onClearDashboardFilter,
}) => {
  const navigate = useNavigate();
  const columnNames = {
    manufacturer: "Manufacturer",
    model: "Model",
    type: "Type",
    aquisition_date: "Aquisition Date",
    caliber_gauge: "Caliber",
    serial_number: "Serial Number",
    asset_tag: "Asset Tag",
    current_status: "Status",
  };

  const columns = [
    { title: columnNames.manufacturer, key: "manufacturer" },
    { title: columnNames.model, key: "model" },
    { title: columnNames.type, key: "type" },
    { title: columnNames.aquisition_date, key: "aquisition_date" },
    { title: columnNames.caliber_gauge, key: "caliber" },
    { title: columnNames.serial_number, key: "serial_number" },
    { title: columnNames.asset_tag, key: "asset_tag" },
    { title: columnNames.current_status, key: "current_status" },
    { title: "", key: "actions" }, // Actions column
  ];

  if (isLoading) {
    return (
      <PageSection className="flex justify-center p-8">
        <Spinner size="lg" />
      </PageSection>
    );
  }

  const renderTableRows = () => {
    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-48 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-red-600">
              <AlertTriangle className="h-8 w-8" />
              <p>Error loading firearms</p>
              <p className="text-sm text-subtext-color">
                There was a problem loading your inventory. Please try again
                later.
              </p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (firearms.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-48 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
              {filterValue ? (
                <>
                  <Search className="h-8 w-8 opacity-50" />
                  <p>No Results found</p>
                  <p className="text-sm">
                    No firearms match your current filter criteria.
                  </p>
                </>
              ) : (
                <>
                  <Box className="h-8 w-8 opacity-0" />
                  <p> No firearms in inventory</p>
                  <p className="text-sm">
                    Get started by adding a firearm to your inventory.
                  </p>
                </>
              )}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return firearms.map((repo: Firearm) => (
      <TableRow
        key={repo.firearm_id}
        onClick={() => navigate(`/Firearms/${repo.firearm_id}`)}
        className="cursor-pointer hover:bg-gray-50"
      >
        <TableCell>{repo.manufacturer}</TableCell>
        <TableCell>{repo.model}</TableCell>
        <TableCell>{repo.type}</TableCell>
        <TableCell>
          {new Date(repo.acquisition_date).toLocaleDateString("en-US")}
        </TableCell>
        <TableCell>{repo.caliber_gauge}</TableCell>
        <TableCell>{repo.serial_number}</TableCell>
        <TableCell>{repo.asset_tag}</TableCell>
        <TableCell>{repo.current_status}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="link"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFirearm(repo);
            }}
            aria-label="Delete"
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const renderMobileContent = () => {
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-red-600">
          <AlertTriangle className="h-8 w-8" />
          <p>Error loading firearms</p>
          <p className="text-sm text-subtext-color">
            There was a problem loading your inventory. Please try again later.
          </p>
        </div>
      );
    }

    if (firearms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-gray-500">
          {filterValue ? (
            <>
              <Search className="h-8 w-8 opacity-50" />
              <p>No Results found</p>
              <p className="text-sm">
                No firearms match your current filter criteria.
              </p>
            </>
          ) : (
            <>
              <Box className="h-8 w-8 opacity-0" />
              <p> No firearms in inventory</p>
              <p className="text-sm">
                Get started by adding a firearm to your inventory.
              </p>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {firearms.map((repo) => (
          <div key={repo.firearm_id} className="relative">
            <button
              type="button"
              className="w-full text-left rounded-lg border border-neutral-border bg-default-background p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              onClick={() => navigate(`/Firearms/${repo.firearm_id}`)}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="pr-8">
                  <h3 className="font-medium text-default-font">
                    {repo.manufacturer} {repo.model}
                  </h3>
                  <p className="text-sm text-subtext-color">{repo.type}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-subtext-color">
                <div className="flex justify-between">
                  <span>Caliber:</span>
                  <span className="text-default-font">
                    {repo.caliber_gauge}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Serial:</span>
                  <span className="text-default-font">
                    {repo.serial_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-default-font">
                    {repo.current_status}
                  </span>
                </div>
              </div>
            </button>
            <div className="absolute top-4 right-4">
              <Button
                variant="link"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFirearm(repo);
                }}
                aria-label="Delete"
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageSection>
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col gap-4">
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem className="w-full sm:w-72">
                  <Input
                    placeholder="Filter by keyword"
                    value={filterValue}
                    onChange={(e) => onFilterChange(e, e.target.value)}
                    startContent={<Search className="h-4 w-4" />}
                  />
                  <div className="mt-2">
                    <FilterFeedback
                      filterValue={filterValue}
                      onClear={() => onFilterChange({} as any, "")}
                    />
                    {dashboardFilterLabel && (
                      <FilterFeedback
                        label="status"
                        filterValue={dashboardFilterLabel}
                        onClear={onClearDashboardFilter}
                      />
                    )}
                  </div>
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
                          key={column.title}
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
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows()}</TableBody>
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
    </PageSection>
  );
};

export { FirearmsTable };
