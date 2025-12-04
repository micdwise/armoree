import * as React from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ISortBy,
  ActionsColumn,
} from "@patternfly/react-table";
import { Ammunition } from "@app/Ammunition/AmmunitionData";
import {
  PageBody,
  PageSection,
  Toolbar,
  Spinner,
  Alert,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Pagination,
  EmptyState,
  EmptyStateBody,
} from "@patternfly/react-core";
import { CubesIcon, SearchIcon } from "@patternfly/react-icons";

interface AmmunitionTableProps {
  ammunition: Ammunition[];
  isLoading: boolean;
  isError: boolean;
  sortBy: ISortBy;
  onSort: (event: React.MouseEvent, index: number, direction: any) => void;
  itemCount: number;
  page: number;
  perPage: number;
  onSetPage: (event: any, newPage: number) => void;
  onPerPageSelect: (event: any, newPerPage: number, newPage: number) => void;
  onDeleteAmmunition: (ammunition: Ammunition) => void;
  filterValue: string;
  onFilterChange: (
    event: React.FormEvent<HTMLInputElement>,
    value: string
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
    { title: columnNames.manufacturer },
    { title: columnNames.brand },
    { title: columnNames.purchase_date },
    { title: columnNames.caliber },
    { title: columnNames.lot_number },
    { title: columnNames.qty },
    "", // Actions column
  ];

  const onClearFilter = () => onFilterChange(null as any, "");

  if (isLoading) {
    return (
      <PageSection>
        <PageBody>
          <Spinner aria-label="Loading Ammunition" />
        </PageBody>
      </PageSection>
    );
  }

  if (isError) {
    return (
      <PageSection>
        <PageBody>
          <Alert variant="danger" title="Error loading ammunition" />
        </PageBody>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <PageBody>
        <Toolbar id="ammunition-toolbar" clearAllFilters={onClearFilter}>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                aria-label="Ammunition Filter"
                value={filterValue}
                onChange={onFilterChange}
                onClear={onClearFilter}
                placeholder="Filter by keyword"
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Selectable table">
          <Thead>
            <Tr>
              {columns.map((column, columnIndex) => (
                <Th
                  key={column.title || "actions-column"}
                  sort={
                    column.title ? { sortBy, onSort, columnIndex } : undefined
                  }>
                  {column.title}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {ammunition.length > 0 ? (
              ammunition.map((repo: Ammunition) => (
                <Tr key={repo.id}>
                  <Td dataLabel={columnNames.manufacturer}>
                    {repo.manufacturer}
                  </Td>
                  <Td dataLabel={columnNames.brand}>{repo.brand}</Td>
                  <Td dataLabel={columnNames.purchase_date}>
                    {new Date(repo.purchase_date).toLocaleDateString("en-US")}
                  </Td>
                  <Td dataLabel={columnNames.caliber}>{repo.caliber}</Td>
                  <Td dataLabel={columnNames.lot_number}>{repo.lot_number}</Td>
                  <Td dataLabel={columnNames.qty}>{repo.qty}</Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          title: "Delete",
                          onClick: () => onDeleteAmmunition(repo),
                        },
                      ]}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length}>
                  <EmptyState
                    titleText={
                      filterValue
                        ? "No Results found"
                        : "No Ammunition in Inventory"
                    }
                    variant="sm"
                    icon={filterValue ? SearchIcon : CubesIcon}>
                    <EmptyStateBody>
                      {filterValue
                        ? "No ammunition matches your current filter criteria."
                        : "Get started by adding ammunition to your inventory."}
                    </EmptyStateBody>
                  </EmptyState>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Pagination
          itemCount={itemCount}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          isCompact
        />
      </PageBody>
    </PageSection>
  );
};

export { AmmunitionTable };
