import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ChevronDown, ChevronRight, Menu, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  routes: any[];
}

export function Sidebar({
  isOpen,
  onClose,
  onOpen,
  routes,
  className,
  ...props
}: Readonly<SidebarProps>) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-neutral-border bg-default-background text-default-font transition-all duration-300 ease-in-out lg:static overflow-hidden",
        isOpen
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full lg:w-16 lg:translate-x-0",
        className
      )}
      {...props}>
      <div
        className={cn(
          "flex h-16 items-center border-b border-neutral-border transition-all duration-300",
          isOpen ? "justify-between px-4" : "justify-center lg:px-0"
        )}>
        <Link
          to="/"
          className={cn(
            "text-xl font-bold text-default-font transition-opacity duration-200 whitespace-nowrap",
            isOpen ? "opacity-100" : "opacity-0 lg:hidden"
          )}>
          Armoree
        </Link>
        {/* Show a mini logo or icon when collapsed if needed, for now just hiding text to prevent overflow */}
        {!isOpen && (
          <Link to="/" className="hidden lg:block font-bold text-xl">
            A
          </Link>
        )}

        <button
          onClick={onClose}
          className="lg:hidden text-subtext-color hover:text-default-font">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 color-brand-100">
        <ul className="space-y-1 px-2">
          {routes.map((route) => (
            <SidebarItem
              key={route.path || route.label}
              route={route}
              currentPath={location.pathname}
              isSidebarOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
            />
          ))}
        </ul>
      </nav>
      <div className="border-t border-neutral-border p-4">
        <button
          onClick={() => supabase.auth.signOut()}
          className={cn(
            "flex w-full items-center rounded-md py-2 text-sm font-medium text-subtext-color transition-colors hover:bg-screen-background hover:text-text-error",
            isOpen ? "px-3 gap-3" : "justify-center px-0"
          )}
          title={isOpen ? undefined : "Logout"}>
          <LogOut className="h-5 w-5" />
          {isOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  route,
  currentPath,
  isSidebarOpen,
  onClose,
  onOpen,
}: Readonly<{
  route: any;
  currentPath: string;
  isSidebarOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}>) {
  if (!route.label) return null;

  const hasChildren = route.routes && route.routes.length > 0;
  return hasChildren ? (
    <SidebarItemWithChildren
      route={route}
      currentPath={currentPath}
      isSidebarOpen={isSidebarOpen}
      onClose={onClose}
      onOpen={onOpen}
    />
  ) : (
    <SidebarItemLeaf
      route={route}
      currentPath={currentPath}
      isSidebarOpen={isSidebarOpen}
      onClose={onClose}
      onOpen={onOpen}
    />
  );
}

function SidebarItemWithChildren({
  route,
  currentPath,
  isSidebarOpen,
  onClose,
  onOpen,
}: Readonly<{
  route: any;
  currentPath: string;
  isSidebarOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const hasChildren = route.routes && route.routes.length > 0;
  const isChildActive =
    hasChildren && route.routes.some((r: any) => r.path === currentPath);

  // Auto expand if child is active and sidebar is open
  React.useEffect(() => {
    if (isSidebarOpen && isChildActive) {
      setIsExpanded(true);
    }
  }, [currentPath, hasChildren, route.routes, isSidebarOpen, isChildActive]);

  // Collapse children when sidebar collapses
  React.useEffect(() => {
    if (!isSidebarOpen) setIsExpanded(false);
  }, [isSidebarOpen]);

  return (
    <li>
      <button
        onClick={() => {
          if (isSidebarOpen) {
            setIsExpanded(!isExpanded);
          } else {
            onOpen();
            setIsExpanded(true);
          }
        }}
        className={cn(
          "flex w-full items-center rounded-md py-2 text-sm font-medium transition-colors",
          isSidebarOpen ? "px-3 justify-between" : "justify-center px-0",
          isChildActive
            ? "bg-brand-highlight-bg text-brand-highlight-text"
            : "text-subtext-color hover:bg-screen-background hover:text-default-font"
        )}
        title={isSidebarOpen ? undefined : route.label}>
        <div
          className={cn(
            "flex items-center",
            isSidebarOpen ? "gap-3" : "justify-center"
          )}>
          {route.icon && <route.icon className="h-5 w-5" />}
          {isSidebarOpen && <span>{route.label}</span>}
        </div>
        {isSidebarOpen &&
          (isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ))}
      </button>
      {isSidebarOpen && isExpanded && (
        <ul className="mt-1 space-y-1 pl-4">
          {route.routes.map((childRoute: any) => (
            <SidebarItem
              key={childRoute.path || childRoute.label}
              route={childRoute}
              currentPath={currentPath}
              isSidebarOpen={isSidebarOpen}
              onClose={onClose}
              onOpen={onOpen}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarItemLeaf({
  route,
  isSidebarOpen,
  onClose,
}: Readonly<{
  route: any;
  currentPath: string;
  isSidebarOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}>) {
  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <li>
      <NavLink
        to={route.path}
        onClick={handleItemClick}
        className={({ isActive }) =>
          cn(
            "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
            isSidebarOpen ? "px-3 gap-3" : "justify-center px-0",
            isActive
              ? "bg-brand-highlight-bg text-brand-highlight-text"
              : "text-subtext-color hover:bg-screen-background hover:text-default-font"
          )
        }
        title={isSidebarOpen ? undefined : route.label}>
        {route.icon && <route.icon className="h-5 w-5" />}
        {isSidebarOpen && route.label}
      </NavLink>
    </li>
  );
}
