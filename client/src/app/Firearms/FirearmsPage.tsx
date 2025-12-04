import * as React from "react";
import {
  Flex,
  FlexItem,
  ActionGroup,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { ISortBy, SortByDirection } from "@patternfly/react-table";
import { FirearmsTable } from "@app/Firearms/FirearmsTable";
import { AddFirearmForm } from "@app/Firearms/AddFirearmForm";
import {
  GetFirearms,
  Firearm,
  DeleteFirearm,
} from "@app/Firearms/FirearmsData";
import { DeleteFirearmModal } from "@app/Firearms/DeleteFirearmModal";

const FirearmsPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetFirearms();
  const [sortBy, setSortBy] = React.useState<ISortBy>({});
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [firearmToDelete, setFirearmToDelete] = React.useState<Firearm | null>(
    null
  );
  const [filterValue, setFilterValue] = React.useState("");

  const columnKeys: (keyof Omit<Firearm, "id">)[] = [
    "manufacturer",
    "model",
    "purchase_date",
    "caliber",
    "serial_number",
  ];

  const onSort = (
    _event: React.MouseEvent,
    index: number,
    direction: SortByDirection
  ) => {
    setSortBy({ index, direction });
  };

  const onFilterChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setFilterValue(value);
    setPage(1); // Reset to first page when filter changes
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    if (!filterValue) return data;

    return data.filter((firearm) =>
      Object.values(firearm).some((val) =>
        String(val).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [data, filterValue]);

  const sortedData = React.useMemo(() => {
    if (sortBy.index === undefined || !filteredData) {
      return filteredData;
    }
    const sortKey = columnKeys[sortBy.index];
    const sorted = [...filteredData].sort((a, b) =>
      a[sortKey] < b[sortKey] ? -1 : 1
    );
    return sortBy.direction === SortByDirection.asc ? sorted : sorted.reverse();
  }, [filteredData, sortBy]);

  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const paginatedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleOpenDeleteModal = (firearm: Firearm) => {
    setFirearmToDelete(firearm);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setFirearmToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteFirearm = () => {
    if (firearmToDelete) {
      DeleteFirearm(firearmToDelete.id)
        .then(refetch)
        .then(handleCloseDeleteModal);
    }
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        <FirearmsTable
          firearms={paginatedData}
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
          onDeleteFirearm={handleOpenDeleteModal}
        />
        <Flex>
          <FlexItem align={{ default: "alignRight" }}>
            <ActionGroup>
              <AddFirearmForm onAddSuccess={refetch} />
            </ActionGroup>
          </FlexItem>
        </Flex>
      </Title>
      <DeleteFirearmModal
        firearm={firearmToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteFirearm}
      />
    </PageSection>
  );
};

export { FirearmsPage };
