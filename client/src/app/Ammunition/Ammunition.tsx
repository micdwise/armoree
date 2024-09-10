import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { TableSelectable } from '@app/Ammunition/AmmunitionTable'
import { AddAmmoForm } from './AddAmmoForm';

const Ammunition: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel='h1' size='lg'>
      <TableSelectable />
      <AddAmmoForm />
    </Title>
  </PageSection>
);

export { Ammunition };