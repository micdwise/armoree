import * as React from 'react';
import { Route, useLocation, RouteComponentProps, Switch } from 'react-router-dom';
import { Ammunition } from '@app/Ammunition/Ammunition';
import { Firearms } from '@app/Firearms/Firearms'
import { Dashboard } from '@app/Dashboard/Dashboard'
import { useDocumentTitle } from '@app/utils/usedocumentTitle';
import { NotFound } from '@app/NotFound/NotFound'


let routeFocusTimer: number;

export interface IAppRoute {
  label?: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: Dashboard,
    exact: true,
    label: 'Dashboard',
    path: '/Dashboard',
    title: 'Dashboard',
  },

  {
    component: Ammunition,
    exact: true,
    label: 'Ammunition',
    path: '/Ammunition',
    title: 'Ammunition',
  },

  {
    component: Firearms,
    exact: true,
    label: 'Firearms',
    path: '/Firearms',
    title: 'Firearms',
  },
];



const useA11yRouteChange = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    routeFocusTimer = window.setTimeout(() => {
      const mainContainer = document.getElementById('primary-app-container');
      if (mainContainer) {
        mainContainer.focus();
      }
    }, 50);
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [pathname]);
};

const RouteWithTitleUpdates = ({ component: Component, title, ...rest }: IAppRoute) => {
  useA11yRouteChange();
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Switch>
    {flattenedRoutes.map(({ path, exact, component, title }, idx) => (
      <RouteWithTitleUpdates path={path} exact={exact} component={component} key={idx} title={title} />
    ))}
    <PageNotFound title="404 Page Not Found" />
  </Switch>
);

export { AppRoutes, routes };