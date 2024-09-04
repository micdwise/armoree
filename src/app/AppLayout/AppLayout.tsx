import * as React from 'react';
import {
  Masthead,
  MastheadMain,
  Nav,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody
 } from '@patternfly/react-core';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const Header = (
    <Masthead>
      <MastheadMain>
        Mast head
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
      sidebar={Sidebar}>
      {children}
      </Page>
  );
};

export { AppLayout };