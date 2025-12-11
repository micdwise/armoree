import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableHead,
} from "../../components/Table";
import { Card, CardContent } from "@components/Card";
import { Ammunition } from "@app/Ammunition/AmmunitionData";
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
import { Search, Box, Trash2, AlertTriangle } from "lucide-react";

export interface SortBy {
  index?: number;
  direction?: "asc" | "desc";
}

interface AmmunitionTableProps {
  ammunition: Ammunition[];
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
  onDeleteAmmunition: (ammunition: Ammunition) => void;
  filterValue: string;
  onFilterChange: (
    event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => void;
}

const AmmunitionTable: React.FunctionComponent<AmmunitionTableProps> = ({
  ammunition,
  isLoading,
  isError,
  sortBy,
  onSort,
  itemCount,
  page,
  perPage,
  onSetPage,
  onPerPageSelect,
  onDeleteAmmunition,
  filterValue,
  onFilterChange,
}) => {
  const columnNames = {
    manufacturer: "Manufacturer",
    brand: "Brand",
    purchase_date: "Purchase Date",
    caliber: "Caliber",
    lot_number: "Lot Number",
    qty: "Quantity",
  };

  const columns = [
    { title: columnNames.manufacturer, key: "manufacturer" },
    { title: columnNames.brand, key: "brand" },
    { title: columnNames.purchase_date, key: "purchase_date" },
    { title: columnNames.caliber, key: "caliber" },
    { title: columnNames.lot_number, key: "lot_number" },
    { title: columnNames.qty, key: "qty" },
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
              <p>Error loading ammunition</p>
              <p className="text-sm text-subtext-color">
                There was a problem loading your inventory. Please try again
                later.
              </p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (ammunition.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-48 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
              {filterValue ? (
                <>
                  <Search className="h-8 w-8 opacity-50" />
                  <p>No results found</p>
                  <p className="text-sm">
                    No ammunition matches your current filter criteria.
                  </p>
                </>
              ) : (
                <>
                  <Box className="h-8 w-8 opacity-50" />
                  <p>No Ammunition in Inventory</p>
                  <p className="text-sm">
                    Get started by adding ammunition to your inventory.
                  </p>
                </>
              )}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return ammunition.map((repo: Ammunition) => (
      <TableRow key={repo.id}>
        <TableCell>{repo.manufacturer}</TableCell>
        <TableCell>{repo.brand}</TableCell>
        <TableCell>
          {new Date(repo.purchase_date).toLocaleDateString("en-US")}
        </TableCell>
        <TableCell>{repo.caliber}</TableCell>
        <TableCell>{repo.lot_number}</TableCell>
        <TableCell>{repo.qty}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="link"
            size="sm"
            onClick={() => onDeleteAmmunition(repo)}
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
          <p>Error loading ammunition</p>
          <p className="text-sm text-subtext-color">
            There was a problem loading your inventory. Please try again later.
          </p>
        </div>
      );
    }

    if (ammunition.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-gray-500">
          {filterValue ? (
            <>
              <Search className="h-8 w-8 opacity-50" />
              <p>No results found</p>
              <p className="text-sm">
                No ammunition matches your current filter criteria.
              </p>
            </>
          ) : (
            <>
              <Box className="h-8 w-8 opacity-50" />
              <p>No Ammunition in Inventory</p>
              <p className="text-sm">
                Get started by adding ammunition to your inventory.
              </p>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ammunition.map((repo) => (
          <div
            key={repo.id}
            className="rounded-lg border border-neutral-border bg-default-background p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-medium text-default-font">
                  {repo.manufacturer} {repo.brand}
                </h3>
                <p className="text-sm text-subtext-color">{repo.caliber}</p>
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={() => onDeleteAmmunition(repo)}
                aria-label="Delete"
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1 text-sm text-subtext-color">
              <div className="flex justify-between">
                <span>Lot Number:</span>
                <span className="text-default-font">{repo.lot_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="text-default-font">{repo.qty}</span>
              </div>
              <div className="flex justify-between">
                <span>Purchase Date:</span>
                <span className="text-default-font">
                  {new Date(repo.purchase_date).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageSection>
      <Card>
        <CardContent className="p-6">
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
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows()}</TableBody>
              </Table>
            </div>

            <Pagination
              itemCount={itemCount}
              perPage={perPage}
              page={page}
              onSetPage={(p) => onSetPage(null, p)}
              onPerPageSelect={(pp) => onPerPageSelect(null, pp, 1)}
            />
          </div>
        </CardContent>
      </Card>
    </PageSection>
  );
};

export { AmmunitionTable };
