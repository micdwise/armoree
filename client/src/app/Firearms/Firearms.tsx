import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

const Firearms: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel='h1' size='lg'>
      Firearms
    </Title>
  </PageSection>
);

export { Firearms };