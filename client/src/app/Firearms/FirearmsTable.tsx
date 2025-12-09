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
import { Firearm } from "@app/Firearms/FirearmsData";
import { PageSection, Toolbar, ToolbarContent, ToolbarItem } from "../../components/Layout";
import { Spinner } from "../../components/Spinner";
import { Alert } from "../../components/Alert";
import { Pagination } from "../../components/Pagination";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Search, Box, Trash2 } from "lucide-react";

export interface SortBy {
  index?: number;
  direction?: "asc" | "desc";
}

interface FirearmsTableProps {
  firearms: Firearm[];
  isLoading: boolean;
  isError: boolean;
  sortBy: SortBy;
  onSort: (event: React.MouseEvent, index: number, direction: "asc" | "desc") => void;
  itemCount: number;
  page: number;
  perPage: number;
  onSetPage: (event: any, newPage: number) => void;
  onPerPageSelect: (event: any, newPerPage: number, newPage: number) => void;
  onDeleteFirearm: (firearm: Firearm) => void;
  filterValue: string;
  onFilterChange: (
    event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => void;
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
}) => {
  const columnNames = {
    manufacturer: "Manufacturer",
    model: "Model",
    purchase_date: "Purchase Date",
    caliber: "Caliber",
    serial_number: "Serial Number",
  };

  const columns = [
    { title: columnNames.manufacturer },
    { title: columnNames.model },
    { title: columnNames.purchase_date },
    { title: columnNames.caliber },
    { title: columnNames.serial_number },
    { title: "" }, // Actions column
  ];

  if (isLoading) {
    return (
      <PageSection className="flex justify-center p-8">
        <Spinner size="lg" />
      </PageSection>
    );
  }

  if (isError) {
    return (
      <PageSection>
        <Alert variant="danger" title="Error loading firearms" />
      </PageSection>
    );
  }

  return (
    <PageSection>
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

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, columnIndex) => (
                  column.title ? (
                    <SortableHead
                      key={column.title}
                      sortDirection={sortBy.index === columnIndex ? sortBy.direction : null}
                      onSort={() =>
                        onSort(
                          null as any,
                          columnIndex,
                          sortBy.index === columnIndex && sortBy.direction === "asc"
                            ? "desc"
                            : "asc"
                        )
                      }
                    >
                      {column.title}
                    </SortableHead>
                  ) : (
                    <TableHead key={columnIndex} />
                  )
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {firearms.length > 0 ? (
                firearms.map((repo: Firearm) => (
                  <TableRow key={repo.id}>
                    <TableCell>{repo.manufacturer}</TableCell>
                    <TableCell>{repo.model}</TableCell>
                    <TableCell>
                      {new Date(repo.purchase_date).toLocaleDateString("en-US")}
                    </TableCell>
                    <TableCell>{repo.caliber}</TableCell>
                    <TableCell>{repo.serial_number}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => onDeleteFirearm(repo)}
                        aria-label="Delete"
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      {filterValue ? (
                        <>
                          <Search className="h-8 w-8 opacity-50" />
                          <p>No results found</p>
                          <p className="text-sm">No firearms match your current filter criteria.</p>
                        </>
                      ) : (
                        <>
                          <Box className="h-8 w-8 opacity-50" />
                          <p>No Firearms in Inventory</p>
                          <p className="text-sm">Get started by adding a new firearm to your inventory.</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
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
    </PageSection>
  );
};

export { FirearmsTable };
