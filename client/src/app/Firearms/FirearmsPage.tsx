import * as React from "react";
import {
  Flex,
  FlexItem,
  ActionGroup,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { FirearmsTable } from "@app/Firearms/FirearmsTable";
import { AddFirearmForm } from "./AddFirearmForm";
import { GetFirearms } from "./FirearmsData";

const FirearmsPage: React.FunctionComponent = () => {
  const { data, isLoading, isError, refetch } = GetFirearms();

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        <FirearmsTable
          firearms={data}
          isLoading={isLoading}
          isError={isError}
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
