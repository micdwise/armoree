import * as React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AppLayout } from "@app/Layout/AppLayout";
import { NotFound } from "@app/NotFound/NotFound";
import {
  LayoutDashboard,
  Users,
  Package,
  Backpack,
  Archive,
  Settings,
  Database,
} from "lucide-react";
import { Spinner } from "@components/Spinner";

// Lazy Loaded Pages
const Dashboard = React.lazy(() =>
  import("@app/Dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);
const PersonnelPage = React.lazy(() =>
  import("./Personnel/PersonnelPage").then((module) => ({
    default: module.PersonnelPage,
  }))
);
const PersonnelDetail = React.lazy(() =>
  import("./Personnel/PersonnelDetail").then((module) => ({
    default: module.PersonnelDetail,
  }))
);

const FirearmsPage = React.lazy(() =>
  import("@app/Firearms/FirearmsPage").then((module) => ({
    default: module.FirearmsPage,
  }))
);
const AmmunitionPage = React.lazy(() =>
  import("@app/Ammunition/AmmunitionPage").then((module) => ({
    default: module.AmmunitionPage,
  }))
);
const FirearmsDetail = React.lazy(() =>
  import("@app/Firearms/FirearmsDetail").then((module) => ({
    default: module.FirearmsDetail,
  }))
);
const ReferenceDataPage = React.lazy(() =>
  import("@app/Settings/ReferenceDataPage").then((module) => ({
    default: module.ReferenceDataPage,
  }))
);

let routeFocusTimer: ReturnType<typeof setTimeout>;

export interface IAppRoute {
  label?: string;
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

const navigationRoutes: AppRouteConfig[] = [
  {
    label: "Dashboard",
    path: "/",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Personnel",
    path: "/Personnel",
    title: "Personnel",
    icon: Users,
  },
  {
    label: "Inventory",
    path: "",
    title: "Inventory",
    icon: Archive,
    routes: [
      {
        label: "Firearms",
        path: "/Firearms",
        title: "Firearms",
        icon: Package,
      },
      {
        label: "Ammunition",
        path: "/Ammunition",
        title: "Ammunition",
        icon: Backpack,
      },
    ],
  },
  {
    label: "Settings",
    path: "",
    title: "Settings",
    icon: Settings,
    routes: [
      {
        label: "Reference Tables",
        path: "/Settings/ReferenceTables",
        title: "Reference Tables",
        icon: Database,
      },
    ],
  },
];

const RouteFocusHandler = () => {
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
  return null;
};

const AppRoot = () => {
  return (
    <AppLayout>
      <RouteFocusHandler />
      <React.Suspense
        fallback={
          <div className="flex h-full items-center justify-center p-4">
            <Spinner aria-label="Loading" />
          </div>
        }>
        <Outlet />
      </React.Suspense>
    </AppLayout>
  );
};

import { ProtectedRoute } from "@app/Auth/ProtectedRoute";
import { LoginPage } from "@app/Auth/LoginPage";

// ... previous imports ...

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppRoot />}>
          <Route index element={<Dashboard />} />
          <Route path="Dashboard" element={<Navigate to="/" replace />} />
          <Route path="Personnel" element={<PersonnelPage />} />
          <Route path="Personnel/:id" element={<PersonnelDetail />} />
          <Route path="Firearms" element={<FirearmsPage />} />
          <Route path="Firearms/:id" element={<FirearmsDetail />} />
          <Route path="Ammunition/*" element={<AmmunitionPage />} />
          <Route
            path="Settings/ReferenceTables"
            element={<ReferenceDataPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </>
  )
);

export { navigationRoutes as routes };
