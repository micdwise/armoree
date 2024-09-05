import * as React from 'react';
import {
  Button,
  Masthead,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody
 } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const Header = (
    <Masthead>
      <MastheadToggle>
        <Button variant="plain" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Global navigation">
          <BarsIcon />
        </Button>
      </MastheadToggle>
      <MastheadMain>
        Armoree
      </MastheadMain>
    </Masthead>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        Side Bar
      </PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';
  return (
    <Page
      mainContainerId={pageId}
      header={Header}
      sidebar={sidebarOpen && Sidebar}>
      {children}
      </Page>
  );
};

export { AppLayout };