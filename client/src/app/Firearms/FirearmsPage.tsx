import * as React from "react";
import { PageSection } from "@components/Layout";
import { FirearmsTable, SortBy } from "@app/Firearms/FirearmsTable";
import { AddFirearmForm } from "@app/Firearms/AddFirearmForm";
import {
  GetFirearms,
  Firearm,
  DeleteFirearm,
} from "@app/Firearms/FirearmsData";
import { DeleteFirearmModal } from "@app/Firearms/DeleteFirearmModal";

const FirearmsPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetFirearms();
  const [sortBy, setSortBy] = React.useState<SortBy>({});
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [firearmToDelete, setFirearmToDelete] = React.useState<Firearm | null>(
    null,
  );
  const [filterValue, setFilterValue] = React.useState("");

  const columnKeys: (keyof Omit<Firearm, "firearm_id">)[] = [
    "manufacturer",
    "model",
    "purchase_date",
    "caliber",
    "serial_number",
  ];

  const onSort = (
    _event: React.MouseEvent,
    index: number,
    direction: "asc" | "desc",
  ) => {
    setSortBy({ index, direction });
  };

  const onFilterChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => {
    setFilterValue(value);
    setPage(1); // Reset to first page when filter changes
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    if (!filterValue) return data;

    return data.filter((firearm) =>
      Object.values(firearm).some((val) =>
        String(val).toLowerCase().includes(filterValue.toLowerCase()),
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
    return sortBy.direction === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortBy]);

  const onSetPage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: any,
    newPerPage: number,
    newPage: number,
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
      DeleteFirearm(firearmToDelete.firearm_id)
        .then(refetch)
        .then(handleCloseDeleteModal);
    }
  };

  return (
    <React.Fragment>
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

      <PageSection>
        <div className="flex justify-end">
          <AddFirearmForm onAddSuccess={refetch} isDisabled={isError} />
        </div>
        <DeleteFirearmModal
          firearm={firearmToDelete}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteFirearm}
        />
      </PageSection>
    </React.Fragment>
  );
};

export { FirearmsPage };
