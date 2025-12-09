import * as React from "react";
import { Route, useLocation, Routes } from "react-router-dom";
import { AmmunitionPage } from "@app/Ammunition/AmmunitionPage";
import { FirearmsPage } from "@app/Firearms/FirearmsPage";
import { Dashboard } from "@app/Dashboard/Dashboard";
import { useDocumentTitle } from "@app/utils/usedocumentTitle";
import { NotFound } from "@app/NotFound/NotFound";
import { LayoutDashboard, Package, Archive } from "lucide-react";

let routeFocusTimer: ReturnType<typeof setTimeout>;

export interface IAppRoute {
  label?: string;
  Component: React.ComponentType<any>;
  exact: boolean;
  path: string;
  title: string;
  icon?: React.ComponentType<any>;
  routes?: IAppRoute[];
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    Component: Dashboard,
    exact: true,
    label: "Dashboard",
    path: "/Dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    Component: FirearmsPage,
    exact: true,
    label: "Firearms",
    path: "/Firearms",
    title: "Firearms",
    icon: Package,
  },

  {
    Component: AmmunitionPage,
    exact: true,
    label: "Ammunition",
    path: "/Ammunition",
    title: "Ammunition",
    icon: Archive,
  },
];

const useA11yRouteChange = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    routeFocusTimer = globalThis.setTimeout(() => {
      const mainContainer = document.getElementById("primary-app-container");
      if (mainContainer) {
        mainContainer.focus();
      }
    }, 50);
    return () => {
      globalThis.clearTimeout(routeFocusTimer);
    };
  }, [pathname]);
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route Component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce((flattened, route) => {
  if ("routes" in route && Array.isArray(route.routes)) {
    return [...flattened, ...route.routes];
  }
  return [...flattened, route as IAppRoute];
}, [] as IAppRoute[]);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    <Route path="/" Component={Dashboard} />
    {flattenedRoutes.map(({ path, Component }) => (
      <Route path={path} Component={Component} key={path} />
    ))}
    {/*<PageNotFound title="404 Page Not Found" /> */}
  </Routes>
);

export { AppRoutes, routes };
