import * as React from "react";
import {
  ActionGroup,
  Flex,
  FlexItem,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { AmmunitionTable } from "@app/Ammunition/AmmunitionTable";
import { AddAmmoForm } from "./AddAmmoForm";
import "@app/App.css"

const AmmunitionPage: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel="h1" size="lg">
      <AmmunitionTable />
      <Flex>
        <FlexItem align={{ default: "alignRight" }}>
          <ActionGroup>
            <AddAmmoForm />
          </ActionGroup>
        </FlexItem>
      </Flex>
    </Title>
  </PageSection>
);

export { AmmunitionPage };
