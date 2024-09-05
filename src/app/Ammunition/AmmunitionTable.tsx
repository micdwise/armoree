import React from 'react';
import { useState } from 'react';
import { 
  Button,
  Flex,
  FlexItem
} from '@patternfly/react-core';
import { 
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td 
} from '@patternfly/react-table';

interface Repository {
  name: string;
  branches: string;
  prs: string;
  workspaces: string;
  lastCommit: string;
};

export const ModalWithForm: React.FunctionComponent = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [nameValue, setNameValue] = React.useState('');
  const [emailValue, setEmailValue] = React.useState('');
  const [addressValue, setAddressValue] = React.useState('');

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setModalOpen(!isModalOpen);
  };

  const handleNameInputChange = (_event, value: string) => {
    setNameValue(value);
  };

  const handleEmailInputChange = (_event, value: string) => {
    setEmailValue(value);
  };
  const handleAddressInputChange = (_event, value: string) => {
    setAddressValue(value);
  };

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleModalToggle}>
        Show modal with form
      </Button>
      <Modal
        variant={ModalVariant.small}
        title="Create account"
        description="Enter your personal information below to create an account."
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="create" variant="primary" form="modal-with-form-form" onClick={handleModalToggle}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        <Form id="modal-with-form-form">
          <FormGroup
            label="Name"
            labelIcon={
              <Popover
                headerContent={
                  <div>
                    The
                    <a href="https://schema.org/name" target="_blank" rel="noopener noreferrer">
                      name
                    </a>
                    of a
                    <a href="https://schema.org/Person" target="_blank" rel="noopener noreferrer">
                      Person
                    </a>
                  </div>
                }
                bodyContent={
                  <div>
                    Often composed of
                    <a href="https://schema.org/givenName" target="_blank" rel="noopener noreferrer">
                      givenName
                    </a>
                    and
                    <a href="https://schema.org/familyName" target="_blank" rel="noopener noreferrer">
                      familyName
                    </a>
                    .
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label="More info for name field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="modal-with-form-form-name"
                  className={formStyles.formGroupLabelHelp}
                >
                  <HelpIcon />
                </button>
              </Popover>
            }
            isRequired
            fieldId="modal-with-form-form-name"
          >
            <TextInput
              isRequired
              type="email"
              id="modal-with-form-form-name"
              name="modal-with-form-form-name"
              value={nameValue}
              onChange={handleNameInputChange}
            />
          </FormGroup>
          <FormGroup
            label="E-mail"
            labelIcon={
              <Popover
                headerContent={
                  <div>
                    The
                    <a href="https://schema.org/email" target="_blank" rel="noopener noreferrer">
                      e-mail
                    </a>
                    of a
                    <a href="https://schema.org/Person" target="_blank" rel="noopener noreferrer">
                      person
                    </a>
                  </div>
                }
                bodyContent={
                  <div>
                    Valid
                    <a href="https://schema.org/email" target="_blank" rel="noopener noreferrer">
                      e-mail
                    </a>
                    address.
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label="More info for e-mail field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="modal-with-form-form-email"
                  className={formStyles.formGroupLabelHelp}
                >
                  <HelpIcon />
                </button>
              </Popover>
            }
            isRequired
            fieldId="modal-with-form-form-email"
          >
            <TextInput
              isRequired
              type="email"
              id="modal-with-form-form-email"
              name="modal-with-form-form-email"
              value={emailValue}
              onChange={handleEmailInputChange}
            />
          </FormGroup>
          <FormGroup
            label="Address"
            labelIcon={
              <Popover
                headerContent={
                  <div>
                    The
                    <a href="https://schema.org/address" target="_blank" rel="noopener noreferrer">
                      adress
                    </a>
                    of a
                    <a href="https://schema.org/Person" target="_blank" rel="noopener noreferrer">
                      person
                    </a>
                  </div>
                }
                bodyContent={
                  <div>
                    Valid
                    <a href="https://schema.org/PostalAddress" target="_blank" rel="noopener noreferrer">
                      postal address.
                    </a>
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label="More info for address field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="modal-with-form-form-address"
                  className={formStyles.formGroupLabelHelp}
                >
                  <HelpIcon />
                </button>
              </Popover>
            }
            isRequired
            fieldId="modal-with-form-form-address"
          >
            <TextInput
              isRequired
              type="email"
              id="modal-with-form-form-address"
              name="modal-with-form-form-address"
              value={addressValue}
              onChange={handleAddressInputChange}
            />
          </FormGroup>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

const TableSelectable: React.FunctionComponent = () => {
  // In real usage, this data would come from some external source like an API via props.
  const repositories: Repository[] = [
    { name: 'one', branches: 'two', prs: 'a', workspaces: 'four', lastCommit: 'five' },
    { name: 'a', branches: 'two', prs: 'k', workspaces: 'four', lastCommit: 'five' },
    { name: 'b', branches: 'two', prs: 'k', workspaces: 'four', lastCommit: 'five' },
    { name: 'c', branches: 'two', prs: 'k', workspaces: 'four', lastCommit: 'five' },
    { name: 'd', branches: 'two', prs: 'k', workspaces: 'four', lastCommit: 'five' },
    { name: 'e', branches: 'two', prs: 'b', workspaces: 'four', lastCommit: 'five' }
  ];

  const columnNames = {
    name: 'Repositories',
    branches: 'Branches',
    prs: 'Pull requests',
    workspaces: 'Workspaces',
    lastCommit: 'Last commit'
  };

  const isRepoSelectable = (repo: Repository) => repo.name !== 'a'; // Arbitrary logic for this example
  const selectableRepos = repositories.filter(isRepoSelectable);

  // In this example, selected rows are tracked by the repo names from each row. This could be any unique identifier.
  // This is to prevent state from being based on row order index in case we later add sorting.
  const [selectedRepoNames, setSelectedRepoNames] = React.useState<string[]>([]);
  const setRepoSelected = (repo: Repository, isSelecting = true) =>
    setSelectedRepoNames((prevSelected) => {
      const otherSelectedRepoNames = prevSelected.filter((r) => r !== repo.name);
      return isSelecting && isRepoSelectable(repo) ? [...otherSelectedRepoNames, repo.name] : otherSelectedRepoNames;
    });
  const selectAllRepos = (isSelecting = true) =>
    setSelectedRepoNames(isSelecting ? selectableRepos.map((r) => r.name) : []);
  const areAllReposSelected = selectedRepoNames.length === selectableRepos.length;
  const isRepoSelected = (repo: Repository) => selectedRepoNames.includes(repo.name);

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
              <Th>{columnNames.name}</Th>
              <Th>{columnNames.branches}</Th>
              <Th>{columnNames.prs}</Th>
              <Th>{columnNames.workspaces}</Th>
              <Th>{columnNames.lastCommit}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {repositories.map((repo, rowIndex) => (
              <Tr key={repo.name}>
                <Td
                  select={{
                    rowIndex,
                    onSelect: (_event, isSelecting) => onSelectRepo(repo, rowIndex, isSelecting),
                    isSelected: isRepoSelected(repo),
                    isDisabled: !isRepoSelectable(repo)
                  }}
                />
                <Td dataLabel={columnNames.name}>{repo.name}</Td>
                <Td dataLabel={columnNames.branches}>{repo.branches}</Td>
                <Td dataLabel={columnNames.prs}>{repo.prs}</Td>
                <Td dataLabel={columnNames.workspaces}>{repo.workspaces}</Td>
                <Td dataLabel={columnNames.lastCommit}>{repo.lastCommit}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <div>
      <Flex>
          <FlexItem align={{default: 'alignRight'}}>
            <Button variant="primary" size='sm' onClick={ModalWithForm}>Add</Button>
          </FlexItem>
        </Flex>
        
      </div>
    </div>
  );
};

export { TableSelectable };