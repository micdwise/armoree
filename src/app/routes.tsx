import * as React from 'react';
import { Route, useLocation, RouteComponentProps } from 'react-router-dom';
import { Ammunition } from '@app/Ammunition/Ammunition';

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
    component: Ammunition;
    exact: true,
    label: 'Ammunition',
    path: '/Ammunition',
    title: 'Ammunition',
  },
];