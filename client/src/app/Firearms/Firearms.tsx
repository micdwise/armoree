import * as React from 'react';
import { Flex, FlexItem, ActionGroup, PageSection, Title } from '@patternfly/react-core';
import { FirearmsTable } from './FirearmsTable';
import { AddFirearmForm } from './AddFirearmForm';

const Firearms: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel='h1' size='lg'>
      <FirearmsTable />
      <Flex>
        <FlexItem align={{ default: 'alignRight'}}>
          <ActionGroup>
            <AddFirearmForm />
          </ActionGroup> 
        </FlexItem>
      </Flex>
    </Title>
  </PageSection>
);

export { Firearms };