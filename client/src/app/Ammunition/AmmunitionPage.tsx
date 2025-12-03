import * as React from "react";
import {
  ActionGroup,
  Flex,
  FlexItem,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { AmmunitionTable } from "@app/Ammunition/AmmunitionTable";
import { AddAmmoForm } from "@app/Ammunition/AddAmmoForm";
import { GetAmmunition } from "@app/Ammunition/AmmunitionData";
import "@app/App.css";

const AmmunitionPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetAmmunition();

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        <AmmunitionTable
          ammunition={data}
          isLoading={isLoading}
          isError={isError}
        />
        <Flex>
          <FlexItem align={{ default: "alignRight" }}>
            <ActionGroup>
              <AddAmmoForm onAddSuccess={refetch} />
            </ActionGroup>
          </FlexItem>
        </Flex>
      </Title>
    </PageSection>
  );
};

export { AmmunitionPage };
