import * as React from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  ISortBy,
  Td,
  ActionsColumn,
} from "@patternfly/react-table";
import { Firearm } from "@app/Firearms/FirearmsData";
import {
  PageBody,
  PageSection,
  Spinner,
  Toolbar,
  Alert,
  Pagination,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
} from "@patternfly/react-core";

interface FirearmsTableProps {
  firearms: Firearm[];
  isLoading: boolean;
  isError: boolean;
  sortBy: ISortBy;
  onSort: (event: React.MouseEvent, index: number, direction: any) => void;
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
    "", // Actions column
  ];

  const onClearFilter = () => onFilterChange(null as any, "");

  if (isLoading) {
    return (
      <PageSection>
        <PageBody>
          <Spinner aria-label="Loading Firearms" />
        </PageBody>
      </PageSection>
    );
  }

  if (isError) {
    return (
      <PageSection>
        <PageBody>
          <Alert variant="danger" title="Error loading firearms" />
        </PageBody>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <PageBody>
        <Toolbar id="firearms-toolbar" clearAllFilters={onClearFilter}>
          <ToolbarContent>
            <ToolbarItem variant="search-filter">
              <SearchInput
                aria-label="Firearms filter"
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
            {firearms.map((repo: Firearm) => (
              <Tr key={repo.id}>
                <Td dataLabel={columnNames.manufacturer}>
                  {repo.manufacturer}
                </Td>
                <Td dataLabel={columnNames.model}>{repo.model}</Td>
                <Td dataLabel={columnNames.purchase_date}>
                  {new Date(repo.purchase_date).toLocaleDateString("en-US")}
                </Td>
                <Td dataLabel={columnNames.caliber}>{repo.caliber}</Td>
                <Td dataLabel={columnNames.serial_number}>
                  {repo.serial_number}
                </Td>
                <Td isActionCell>
                  <ActionsColumn
                    items={[
                      {
                        title: "Delete",
                        onClick: () => onDeleteFirearm(repo),
                      },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
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

export { FirearmsTable };
