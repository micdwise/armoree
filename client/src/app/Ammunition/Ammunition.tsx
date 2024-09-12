import * as React from 'react';
import { ActionGroup, Flex, FlexItem, PageSection, Title } from '@patternfly/react-core';
import { TableSelectable } from '@app/Ammunition/AmmunitionTable'
import { AddAmmoForm } from './AddAmmoForm';

const Ammunition: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel='h1' size='lg'>
      <TableSelectable />
      <Flex>
        <FlexItem align={{ default: 'alignRight'}}>
          <ActionGroup>
            <AddAmmoForm />
          </ActionGroup> 
        </FlexItem>
      </Flex>
    </Title>
  </PageSection>
);

export { Ammunition };