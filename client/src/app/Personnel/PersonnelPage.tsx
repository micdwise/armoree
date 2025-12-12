import * as React from "react";
import { PageSection } from "@components/index";
import { PersonnelTable, SortBy } from "./PersonnelTable";
import {
  usePersonnel,
  Personnel,
  deletePersonnel,
  getExpiringPersonnelIds,
} from "./hooks";
import { useSearchParams } from "react-router-dom";

import { AddPersonnelForm } from "./AddPersonnelForm";
import { DeletePersonnelModal } from "./DeletePersonnelModal";

const PersonnelPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = usePersonnel();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = React.useState<SortBy>({});
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [personnelToDelete, setPersonnelToDelete] =
    React.useState<Personnel | null>(null);

  // Filter State
  const initialFilter = searchParams.get("search") || "";
  const [filterValue, setFilterValue] = React.useState(initialFilter);
  const activeFilterType = searchParams.get("filter"); // e.g. 'expiring'
  const [expiringIds, setExpiringIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (activeFilterType === "expiring") {
      getExpiringPersonnelIds().then(setExpiringIds);
    } else {
      setExpiringIds([]);
    }
  }, [activeFilterType]);

  const columnKeys: (keyof Personnel)[] = [
    "badge_number",
    "last_name",
    "first_name",
    "status",
  ];

  // Handlers
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
  };

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    let filtered = data;

    // Special Dashboard Filter
    if (activeFilterType === "expiring") {
      filtered = filtered.filter((p) => expiringIds.includes(p.personnel_id));
    }

    if (!filterValue) return filtered;

    return filtered.filter((p) =>
      Object.values(p).some((val) =>
        String(val).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [data, filterValue, activeFilterType, expiringIds]);

  const sortedData = React.useMemo(() => {
    if (sortBy.index === undefined || sortBy.direction === undefined) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const keys = columnKeys;
      const key = keys[sortBy.index!];

      // Handle undefined/null values
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      if (aValue < bValue) {
        return sortBy.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortBy.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortBy]);

  const paginatedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleOpenDeleteModal = (person: Personnel) => {
    setPersonnelToDelete(person);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setPersonnelToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeletePersonnel = () => {
    if (personnelToDelete) {
      deletePersonnel(personnelToDelete.personnel_id)
        .then(refetch)
        .then(handleCloseDeleteModal);
    }
  };

  return (
    <PageSection>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personnel</h1>
        <AddPersonnelForm onAddSuccess={refetch} isDisabled={isError} />
      </div>

      <PersonnelTable
        personnel={paginatedData}
        isLoading={isLoading}
        isError={isError}
        sortBy={sortBy}
        onSort={onSort}
        itemCount={filteredData.length}
        page={page}
        perPage={perPage}
        onSetPage={(e, p) => setPage(p)}
        onPerPageSelect={(e, pp) => setPerPage(pp)}
        filterValue={filterValue}
        onFilterChange={onFilterChange}
        onDeletePersonnel={handleOpenDeleteModal}
        onViewTraining={() => {}} // No longer used
        dashboardFilterLabel={
          activeFilterType === "expiring"
            ? "Expiring Qualifications"
            : undefined
        }
        onClearDashboardFilter={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("filter");
          setSearchParams(newParams);
        }}
      />

      <DeletePersonnelModal
        personnel={personnelToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeletePersonnel}
      />
    </PageSection>
  );
};

export { PersonnelPage };
