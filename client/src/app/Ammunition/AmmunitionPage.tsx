import * as React from "react";
import { PageSection } from "@components/Layout";
import { AmmunitionTable, SortBy } from "@app/Ammunition/AmmunitionTable";
import { AddAmmoForm } from "@app/Ammunition/AddAmmoForm";
import {
  Ammunition,
  GetAmmunition,
  DeleteAmmunition,
} from "@app/Ammunition/AmmunitionData";
import { DeleteAmmunitionModal } from "./DeleteAmmunitionModal";

import { useSearchParams } from "react-router-dom";
// ... imports

const AmmunitionPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetAmmunition();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = React.useState<SortBy>({});
  /* State */
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [ammunitionToDelete, setAmmunitionToDelete] =
    React.useState<Ammunition | null>(null);

  // Initialize filterValue
  const [filterValue, setFilterValue] = React.useState("");
  const activeFilterType = searchParams.get("filter");

  const columnKeys: (keyof Omit<Ammunition, "ammo_id">)[] = [
    "manufacturer",
    "caliber_gauge",
    "lot_number",
    "quantity_on_hand",
  ];

  /* Handlers */
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
    setPage(1);
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    let filtered = data;

    if (activeFilterType === "low_stock") {
      filtered = filtered.filter(
        (a) =>
          a.min_stock_level !== undefined &&
          a.min_stock_level !== null &&
          a.quantity_on_hand < a.min_stock_level,
      );
    }

    if (!filterValue) return filtered;

    return filtered.filter((ammunition) =>
      Object.values(ammunition).some((val) =>
        String(val).toLocaleLowerCase().includes(filterValue.toLowerCase()),
      ),
    );
  }, [data, filterValue, activeFilterType]);

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
      DeleteAmmunition(ammunitionToDelete.ammo_id)
        .then(refetch)
        .then(handleClosedDeleteModal);
    }
  };

  return (
    <PageSection>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ammunition</h1>
        <AddAmmoForm onAddSuccess={refetch} isDisabled={isError} />
      </div>
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
        dashboardFilterLabel={
          activeFilterType === "low_stock" ? "Low Stock" : undefined
        }
        onClearDashboardFilter={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("filter");
          setSearchParams(newParams);
        }}
      />

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
