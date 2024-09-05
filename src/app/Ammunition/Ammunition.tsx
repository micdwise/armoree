import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { TableSelectable } from '@app/Ammunition/AmmunitionTable'

const Ammunition: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel='h1' size='lg'>
      <TableSelectable />
    </Title>
  </PageSection>
);

export { Ammunition };