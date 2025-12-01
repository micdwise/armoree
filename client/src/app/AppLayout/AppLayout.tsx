import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Button,
  ButtonVariant,
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
  PageSidebarBody,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { IAppRoute, IAppRouteGroup, routes } from "@app/routes";
import { BarsIcon, BellIcon, CogIcon } from "@patternfly/react-icons";
import { AboutModalBasic } from "@app/AppLayout/About";
import "@app/App.css";

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const headerToolbar = (
    <Toolbar id="toolbar" isFullHeight isStatic>
      <ToolbarContent>
        <ToolbarGroup
          variant="action-group-plain"
          align={{ default: "alignEnd" }}
          gap={{ default: "gapNone", md: "gapMd" }}>
          <ToolbarItem>
            <Button
              aria-label="Notifications"
              variant={ButtonVariant.plain}
              icon={<BellIcon />}
            />
          </ToolbarItem>
          <ToolbarGroup
            variant="action-group-plain"
            visibility={{ default: "hidden", lg: "visible" }}>
            <ToolbarItem>
              <Button
                aria-label="Settings"
                variant={ButtonVariant.plain}
                icon={<CogIcon />}
              />
            </ToolbarItem>
            <ToolbarItem>
              <AboutModalBasic />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const Header = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        Armoree
      </MastheadMain>
      <MastheadContent>{headerToolbar}</MastheadContent>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem
      key={`${route.label}-${index}`}
      id={`${route.label}-${index}`}
      isActive={route.path === location.pathname}>
      <NavLink to={route.path}>{route.label}</NavLink>
    </NavItem>
  );

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some((route) => route.path === location.pathname)}>
      {group.routes.map(
        (route, idx) => route.label && renderNavItem(route, idx)
      )}
    </NavExpandable>
  );

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {routes.map(
          (route, idx) =>
            route.label &&
            (route.routes
              ? renderNavGroup(route as IAppRouteGroup, idx)
              : renderNavItem(route as IAppRoute, idx))
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = "primary-app-container";
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
