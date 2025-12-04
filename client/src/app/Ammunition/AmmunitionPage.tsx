import * as React from "react";
import {
  ActionGroup,
  Flex,
  FlexItem,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { ISortBy, SortByDirection } from "@patternfly/react-table";
import { AmmunitionTable } from "@app/Ammunition/AmmunitionTable";
import { AddAmmoForm } from "@app/Ammunition/AddAmmoForm";
import {
  Ammunition,
  GetAmmunition,
  DeleteAmmunition,
} from "@app/Ammunition/AmmunitionData";
import "@app/App.css";
import { DeleteAmmunitionModal } from "./DeleteAmmunitionModal";

const AmmunitionPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetAmmunition();
  const [sortBy, setSortBy] = React.useState<ISortBy>({});
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [ammunitionToDelete, setAmmunitionToDelete] =
    React.useState<Ammunition | null>(null);
  const [filterValue, setFilterValue] = React.useState("");

  const columnKeys: (keyof Omit<Ammunition, "id">)[] = [
    "manufacturer",
    "brand",
    "purchase_date",
    "caliber",
    "lot_number",
    "qty",
  ];

  const onSort = (
    _event: React.MouseEvent,
    index: number,
    direction: SortByDirection,
  ) => {
    setSortBy({ index, direction });
  };

  const onFilterChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setFilterValue(value);
    setPage(1); //Reset to first page when filter changes
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    if (!filterValue) return data;

    return data.filter((ammunition) =>
      Object.values(ammunition).some((val) =>
        String(val).toLocaleLowerCase().includes(filterValue.toLowerCase()),
      ),
    );
  }, [data, filterValue]);

  const sortedData = React.useMemo(() => {
    if (sortBy.index === undefined || !filteredData) {
      return filteredData;
    }
    const sortKey = columnKeys[sortBy.index];
    const sorted = [...filteredData].sort((a, b) =>
      a[sortKey] < b[sortKey] ? -1 : 1,
    );
    return sortBy.direction === SortByDirection.asc ? sorted : sorted.reverse();
  }, [filteredData, sortBy]);

  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const paginatedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleOpenDeleteModal = (ammunition: Ammunition) => {
    setAmmunitionToDelete(ammunition);
    setIsDeleteModalOpen(true);
  };

  const handleClosedDeleteModal = () => {
    setAmmunitionToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAmmunition = () => {
    if (ammunitionToDelete) {
      DeleteAmmunition(ammunitionToDelete.id)
        .then(refetch)
        .then(handleClosedDeleteModal);
    }
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        <AmmunitionTable
          ammunition={paginatedData}
          isLoading={isLoading}
          isError={isError}
          sortBy={sortBy}
          onSort={onSort}
          itemCount={sortedData?.length || 0}
          page={page}
          perPage={perPage}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          filterValue={filterValue}
          onFilterChange={onFilterChange}
          onDeleteAmmunition={handleOpenDeleteModal}
        />
        <Flex>
          <FlexItem align={{ default: "alignRight" }}>
            <ActionGroup>
              <AddAmmoForm onAddSuccess={refetch} />
            </ActionGroup>
          </FlexItem>
        </Flex>
      </Title>
      <DeleteAmmunitionModal
        ammunition={ammunitionToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleClosedDeleteModal}
        onConfirm={handleDeleteAmmunition}
      />
    </PageSection>
  );
};

export { AmmunitionPage };
