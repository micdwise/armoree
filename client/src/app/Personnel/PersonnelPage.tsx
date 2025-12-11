import * as React from "react";
import { PageSection } from "@components/Layout";
import { PersonnelTable, SortBy } from "./PersonnelTable";
import { GetPersonnel, Personnel, DeletePersonnel } from "./PersonnelData";
import { useSearchParams } from "react-router-dom";

import { AddPersonnelForm } from "./AddPersonnelForm";
import { DeletePersonnelModal } from "./DeletePersonnelModal";
import { TrainingManagementModal } from "./TrainingManagementModal";

const PersonnelPage: React.FunctionComponent = () => {
    const { data, isLoading, isError, refetch } = GetPersonnel();
    const [searchParams] = useSearchParams();


    const [sortBy, setSortBy] = React.useState<SortBy>({});
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [personnelToDelete, setPersonnelToDelete] = React.useState<Personnel | null>(null);
    const [trainingPersonnel, setTrainingPersonnel] = React.useState<Personnel | null>(null);

    // Filter State
    const initialFilter = searchParams.get("search") || "";
    const [filterValue, setFilterValue] = React.useState(initialFilter);
    const activeFilterType = searchParams.get("filter"); // e.g. 'expiring'

    const columnKeys: (keyof Personnel)[] = ["badge_number", "last_name", "first_name", "status"];

    // Handlers
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

        // Special Dashboard Filter
        if (activeFilterType === 'expiring') {
            // Mock logic for now since explicit qualification data isn't joined yet
            // In a real scenario, check `p.qualification_expiry`
            filtered = filtered.filter(p => p.status === 'Active'); // Placeholder: filter active only or similar
        }

        if (!filterValue) return filtered;

        return filtered.filter((p) =>
            Object.values(p).some((val) =>
                String(val).toLowerCase().includes(filterValue.toLowerCase())
            )
        );
    }, [data, filterValue, activeFilterType]);

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
            DeletePersonnel(personnelToDelete.personnel_id)
                .then(refetch)
                .then(handleCloseDeleteModal);
        }
    }

    const handleViewTraining = (person: Personnel) => {
        setTrainingPersonnel(person);
    };

    const handleCloseTrainingModal = () => {
        setTrainingPersonnel(null);
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
                onViewTraining={handleViewTraining}
            />

            <DeletePersonnelModal
                personnel={personnelToDelete}
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeletePersonnel}
            />

            <TrainingManagementModal
                personnel={trainingPersonnel}
                isOpen={!!trainingPersonnel}
                onClose={handleCloseTrainingModal}
            />
        </PageSection>
    );
};

export { PersonnelPage };
