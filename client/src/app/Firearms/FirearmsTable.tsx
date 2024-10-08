import React from "react";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { GetFirearms, Firearm } from "@app/Firearms/FirearmsData";
import { PageBody, PageSection, Toolbar } from "@patternfly/react-core";

const FirearmsTable: React.FunctionComponent = () => {
  const { data: repositories } = GetFirearms(); // Fetch ammunition data

  const columnNames = {
    manufacturer: "Manufacturer",
    model: "Model",
    purchase_date: "Purchase Date",
    caliber: "Caliber",
    serial_number: "Serial Number",
  };

  return (
    <PageSection>
      <PageBody>
        <Toolbar>Toolbar</Toolbar>
        <Table aria-label="Selectable table">
          <Thead>
            <Tr>
              <Th>{columnNames.manufacturer}</Th>
              <Th>{columnNames.model}</Th>
              <Th>{columnNames.purchase_date}</Th>
              <Th>{columnNames.caliber}</Th>
              <Th>{columnNames.serial_number}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {repositories.map((repo: Firearm) => (
              <Tr key={repo.id}>
                <Td dataLabel={columnNames.manufacturer}>
                  {repo.manufacturer}
                </Td>
                <Td dataLabel={columnNames.model}>{repo.model}</Td>
                <Td dataLabel={columnNames.purchase_date}>
                  {repo.purchase_date}
                </Td>
                <Td dataLabel={columnNames.caliber}>{repo.caliber}</Td>
                <Td dataLabel={columnNames.serial_number}>
                  {repo.serial_number}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageBody>
    </PageSection>
  );
};

export { FirearmsTable };
