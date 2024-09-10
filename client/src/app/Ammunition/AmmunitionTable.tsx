import React from 'react';
import { useState } from 'react';
import { 
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td 
} from '@patternfly/react-table';

interface Repository {
  manufacturer: string;
  brand: string;
  prchsdate: string;
  caliber: string;
  lotnumber: string;
};

const TableSelectable: React.FunctionComponent = () => {
  // In real usage, this data would come from some external source like an API via props.
  const repositories: Repository[] = [
    { manufacturer: 'one', brand: 'two', prchsdate: 'a', caliber: 'four', lotnumber: 'five' },
    { manufacturer: 'a', brand: 'two', prchsdate: 'k', caliber: 'four', lotnumber: 'five' },
    { manufacturer: 'b', brand: 'two', prchsdate: 'k', caliber: 'four', lotnumber: 'five' },
    { manufacturer: 'c', brand: 'two', prchsdate: 'k', caliber: 'four', lotnumber: 'five' },
    { manufacturer: 'd', brand: 'two', prchsdate: 'k', caliber: 'four', lotnumber: 'five' },
    { manufacturer: 'e', brand: 'two', prchsdate: 'b', caliber: 'four', lotnumber: 'five' },
    { manufacturer: 'mine', brand: 'three', prchsdate: 'z', caliber: 'six', lotnumber: 'seven'}
  ];

  const columnNames = {
    manufacturer: 'Manufacturer',
    brand: 'Brand',
    prchdate: 'Purchase Date',
    caliber: 'Caliber',
    lotnumber: 'Lot Number'
  };

  const isRepoSelectable = (repo: Repository) => repo.manufacturer !== 'a'; // Arbitrary logic for this example
  const selectableRepos = repositories.filter(isRepoSelectable);

  // In this example, selected rows are tracked by the repo names from each row. This could be any unique identifier.
  // This is to prevent state from being based on row order index in case we later add sorting.
  const [selectedRepoNames, setSelectedRepoNames] = React.useState<string[]>([]);
  const setRepoSelected = (repo: Repository, isSelecting = true) =>
    setSelectedRepoNames((prevSelected) => {
      const otherSelectedRepoNames = prevSelected.filter((r) => r !== repo.manufacturer);
      return isSelecting && isRepoSelectable(repo) ? [...otherSelectedRepoNames, repo.manufacturer] : otherSelectedRepoNames;
    });
  const selectAllRepos = (isSelecting = true) =>
    setSelectedRepoNames(isSelecting ? selectableRepos.map((r) => r.manufacturer) : []);
  const areAllReposSelected = selectedRepoNames.length === selectableRepos.length;
  const isRepoSelected = (repo: Repository) => selectedRepoNames.includes(repo.manufacturer);

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<number | null>(null);
  const [shifting, setShifting] = React.useState(false);

  const onSelectRepo = (repo: Repository, rowIndex: number, isSelecting: boolean) => {
    // If the user is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(new Array(numberSelected + 1), (_x, i) => i + recentSelectedRowIndex)
          : Array.from(new Array(Math.abs(numberSelected) + 1), (_x, i) => i + rowIndex);
      intermediateIndexes.forEach((index) => setRepoSelected(repositories[index], isSelecting));
    } else {
      setRepoSelected(repo, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
  };

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div>
      <div>
        <Table aria-label="Selectable table">
          <Thead>
            <Tr>
              <Th
                select={{
                  onSelect: (_event, isSelecting) => selectAllRepos(isSelecting),
                  isSelected: areAllReposSelected
                }}
                aria-label="Row select"
              />
              <Th>{columnNames.manufacturer}</Th>
              <Th>{columnNames.brand}</Th>
              <Th>{columnNames.prchdate}</Th>
              <Th>{columnNames.caliber}</Th>
              <Th>{columnNames.lotnumber}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {repositories.map((repo, rowIndex) => (
              <Tr key={repo.manufacturer}>
                <Td
                  select={{
                    rowIndex,
                    onSelect: (_event, isSelecting) => onSelectRepo(repo, rowIndex, isSelecting),
                    isSelected: isRepoSelected(repo),
                    isDisabled: !isRepoSelectable(repo)
                  }}
                />
                <Td dataLabel={columnNames.manufacturer}>{repo.manufacturer}</Td>
                <Td dataLabel={columnNames.brand}>{repo.brand}</Td>
                <Td dataLabel={columnNames.prchdate}>{repo.prchsdate}</Td>
                <Td dataLabel={columnNames.caliber}>{repo.caliber}</Td>
                <Td dataLabel={columnNames.lotnumber}>{repo.lotnumber}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export { TableSelectable };