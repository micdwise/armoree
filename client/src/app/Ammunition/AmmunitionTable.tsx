import * as React from "react";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { GetAmmunition, Ammunition } from "@app/Ammunition/AmmunitionData";
import {
  PageBody,
  PageSection,
  Toolbar,
  Spinner,
  Alert,
  PageGroup,
} from "@patternfly/react-core";

const AmmunitionTable: React.FunctionComponent = () => {
  const { data: repositories, isLoading, isError } = GetAmmunition(); // Fetch ammunition data

  const columnNames = {
    manufacturer: "Manufacturer",
    brand: "Brand",
    purchase_date: "Purchase Date",
    caliber: "Caliber",
    lot_number: "Lot Number",
    qty: "Quantity",
  };

  if (isLoading) {
    return (
      <PageSection>
        <PageBody>
          <Spinner aria-label="Loading Ammunition" />
        </PageBody>
      </PageSection>
    );
  }

  if (isError) {
    return (
      <PageSection>
        <PageBody>
          <Alert variant="danger" title="Error loading ammunition" />
        </PageBody>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <PageBody>
        <Toolbar>Toolbar</Toolbar>
        <Table aria-label="Selectable table">
          <Thead>
            <Tr>
              <Th>{columnNames.manufacturer}</Th>
              <Th>{columnNames.brand}</Th>
              <Th>{columnNames.purchase_date}</Th>
              <Th>{columnNames.caliber}</Th>
              <Th>{columnNames.lot_number}</Th>
              <Th>{columnNames.qty}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {repositories.map((repo: Ammunition) => (
              <Tr key={repo.id}>
                <Td dataLabel={columnNames.manufacturer}>
                  {repo.manufacturer}
                </Td>
                <Td dataLabel={columnNames.brand}>{repo.brand}</Td>
                <Td dataLabel={columnNames.purchase_date}>
                  {repo.purchase_date}
                </Td>
                <Td dataLabel={columnNames.caliber}>{repo.caliber}</Td>
                <Td dataLabel={columnNames.lot_number}>{repo.lot_number}</Td>
                <Td dataLabel={columnNames.qty}>{repo.qty}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageBody>
    </PageSection>
  );
};

export { AmmunitionTable };
