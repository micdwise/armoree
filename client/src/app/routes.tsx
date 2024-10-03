import * as React from "react";
import { Route, useLocation, Routes } from "react-router-dom";
import { AmmunitionPage } from "@app/Ammunition/AmmunitionPage";
import { FirearmsPage } from "@app/Firearms/FirearmsPage";
import { Dashboard } from "@app/Dashboard/Dashboard";
import { useDocumentTitle } from "@app/utils/usedocumentTitle";
import { NotFound } from "@app/NotFound/NotFound";

let routeFocusTimer: number;

export interface IAppRoute {
  id?: string;
  Component: React.ComponentType<any>;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  id: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    Component: Dashboard,
    id: "Dashboard",
    path: "/Dashboard",
    title: "Dashboard",
  },

  {
    Component: FirearmsPage,
    id: "Firearms",
    path: "/Firearms",
    title: "Firearms",
  },

  {
    Component: AmmunitionPage,
    id: "Ammunition",
    path: "/Ammunition",
    title: "Ammunition",
  },
];

const useA11yRouteChange = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    routeFocusTimer = window.setTimeout(() => {
      const mainContainer = document.getElementById("primary-app-container");
      if (mainContainer) {
        mainContainer.focus();
      }
    }, 50);
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [pathname]);
};

//const RouteWithTitleUpdates = ({
//  Component: RouteComponent,
//  title,
//  ...rest
//}: IAppRoute) => {
//  useA11yRouteChange();
//  useDocumentTitle(title);
//
//  function routeWithTitle() {
//    return <RouteComponent {...rest} />;
//  }
//
//  return <Route Component={routeWithTitle} {...rest} />;
//};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route Component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [
    ...flattened,
    ...(route.routes ? route.routes : [route]),
  ],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    <Route path="/" Component={Dashboard} />
    {flattenedRoutes.map(({ id, path, Component }, idx) => (
      <Route id={id} path={path} Component={Component} key={idx} />
    ))}
    {/*<PageNotFound title="404 Page Not Found" /> */}
  </Routes>
);

export { AppRoutes, routes };
