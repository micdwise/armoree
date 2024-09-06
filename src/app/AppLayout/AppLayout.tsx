import * as React from 'react';
import { NavLink, useLocation} from 'react-router-dom';
import {
  Button,
  Flex,
  FlexItem,
  Masthead,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody
 } from '@patternfly/react-core';
 import { IAppRoute, IAppRouteGroup, routes } from '@app/routes'
import { BarsIcon, BellIcon } from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const Header = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
            <Button icon={<BarsIcon />} variant="plain" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Global navigation" />
        </MastheadToggle>
          Armoree
      </MastheadMain>
      <MastheadContent>
            <BellIcon />
      </MastheadContent>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={'${route.label}-${index}'} id={'${route.label}-${index}'} isActive={route.path === location.pathname}>
      <NavLink exact={route.exact} to={route.path}>
        {route.label}
      </NavLink>
    </NavItem>
  );

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some((route) => route.path === location.pathname)}>
      {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
    </NavExpandable>
  );

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {routes.map(
          (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx))
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        {Navigation}
      </PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';
  return (
    <Page
      mainContainerId={pageId}
      masthead={Header}
      sidebar={sidebarOpen && Sidebar}>
      {children}
      </Page>
  );
};

export { AppLayout };