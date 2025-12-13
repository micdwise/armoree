import * as React from "react";
import { PageSection } from "@components/Layout";
import { FirearmsTable, SortBy } from "@app/Firearms/FirearmsTable";
import { AddFirearmForm } from "@app/Firearms/AddFirearmForm";
import { useFirearms, Firearm, deleteFirearm } from "@app/Firearms/hooks";
import { DeleteFirearmModal } from "@app/Firearms/DeleteFirearmModal";

import { useSearchParams } from "react-router-dom";
// ... imports

const FirearmsPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = useFirearms();
  const [searchParams, setSearchParams] = useSearchParams(); // Get URL params
  const [sortBy, setSortBy] = React.useState<SortBy>({});
  /* State */
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [firearmToDelete, setFirearmToDelete] = React.useState<Firearm | null>(
    null
  );

  // Initialize filterValue from searchParams
  const initialFilter = searchParams.get("search") || "";
  const [filterValue, setFilterValue] = React.useState(initialFilter);
  const activeFilterType = searchParams.get("filter");

  const columnKeys: (keyof Omit<Firearm, "firearm_id" | "next_due_date">)[] = [
    "manufacturer",
    "model",
    "type",
    "acquisition_date",
    "caliber_gauge",
    "serial_number",
    "asset_tag",
    "current_status",
  ];

  /* Handlers */
  const onSort = (
    _event: React.MouseEvent,
    index: number,
    direction: "asc" | "desc"
  ) => {
    setSortBy({ index, direction });
  };

  const onFilterChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setFilterValue(value);
    setPage(1);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    let filtered = data;

    // Apply special filters first
    if (activeFilterType === "maintenance_overdue") {
      const today = new Date();
      filtered = filtered.filter((f) => {
        if (!f.next_due_date) return false;
        return new Date(f.next_due_date) < today;
      });
    }

    if (!filterValue) return filtered;

    return filtered.filter((firearm) =>
      Object.values(firearm).some((val) =>
        String(val).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [data, filterValue, activeFilterType]);

  const sortedData = React.useMemo(() => {
    if (sortBy.index === undefined || !filteredData) {
      return filteredData;
    }
    const sortKey = columnKeys[sortBy.index];
    if (!sortKey) return filteredData;

    const sorted = [...filteredData].sort((a, b) =>
      a[sortKey] < b[sortKey] ? -1 : 1
    );
    return sortBy.direction === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortBy]);

  const onSetPage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: any,
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

  const handleDeleteFirearm = async () => {
    if (!firearmToDelete) return;

    try {
      await deleteFirearm(firearmToDelete.firearm_id);
      await refetch();
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <PageSection>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Firearms</h1>
        <AddFirearmForm onAddSuccess={refetch} isDisabled={isError} />
      </div>

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
        dashboardFilterLabel={
          activeFilterType === "maintenance_overdue"
            ? "Maintenance Overdue"
            : undefined
        }
        onClearDashboardFilter={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("filter");
          setSearchParams(newParams);
        }}
      />

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
