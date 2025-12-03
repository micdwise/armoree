import * as React from "react";
import {
  Flex,
  FlexItem,
  ActionGroup,
  PageSection,
  Title,
  PaginationVariant,
} from "@patternfly/react-core";
import { ISortBy, SortByDirection } from "@patternfly/react-table";
import { FirearmsTable } from "@app/Firearms/FirearmsTable";
import { AddFirearmForm } from "./AddFirearmForm";
import { GetFirearms, Firearm } from "./FirearmsData";

const FirearmsPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetFirearms();
  const [sortBy, setSortBy] = React.useState<ISortBy>({});
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

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

  const sortedData = React.useMemo(() => {
    if (sortBy.index === undefined || !data) {
      return data;
    }
    const sortKey = columnKeys[sortBy.index];
    const sorted = [...data].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));
    return sortBy.direction === SortByDirection.asc ? sorted : sorted.reverse();
  }, [data, sortBy]);

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
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
        <Flex>
          <FlexItem align={{ default: "alignRight" }}>
            <ActionGroup>
              <AddFirearmForm onAddSuccess={refetch} />
            </ActionGroup>
          </FlexItem>
        </Flex>
      </Title>
    </PageSection>
  );
};

export { FirearmsPage };
