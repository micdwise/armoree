import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  routes: any[];
}

export function Sidebar({
  isOpen,
  onClose,
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
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-neutral-border transition-all duration-300",
          isOpen ? "justify-between px-4" : "justify-center lg:px-0",
        )}
      >
        <span
          className={cn(
            "text-xl font-bold text-default-font transition-opacity duration-200 whitespace-nowrap",
            isOpen ? "opacity-100" : "opacity-0 lg:hidden",
          )}
        >
          Armoree
        </span>
        {/* Show a mini logo or icon when collapsed if needed, for now just hiding text to prevent overflow */}
        {!isOpen && (
          <span className="hidden lg:block font-bold text-xl">A</span>
        )}

        <button
          onClick={onClose}
          className="lg:hidden text-subtext-color hover:text-default-font"
        >
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
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({
  route,
  currentPath,
  isSidebarOpen,
}: Readonly<{
  route: any;
  currentPath: string;
  isSidebarOpen: boolean;
}>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const hasChildren = route.routes && route.routes.length > 0;

  // Auto expand if child is active and sidebar is open
  React.useEffect(() => {
    if (
      isSidebarOpen &&
      hasChildren &&
      route.routes.some((r: any) => r.path === currentPath)
    ) {
      setIsExpanded(true);
    }
  }, [currentPath, hasChildren, route.routes, isSidebarOpen]);

  // Collapse children when sidebar collapses
  React.useEffect(() => {
    if (!isSidebarOpen) setIsExpanded(false);
  }, [isSidebarOpen]);

  if (!route.label) return null;

  // If sidebar is collapsed (rail), we probably shouldn't show accordion children inline easily.
  // For simplicity in this iteration:
  // - If collapsed: clicking parent navigates to main route or does nothing (if wrapper)?
  // - Or we can use a Popover.
  // Given user request "Leave the icon showing", showing just the parent icon is standard rail behavior.
  // If clicking it needs to show submenus, that's more complex.
  // We'll treat parent item as a link or toggle. If it has no path, it's just a toggle.

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => isSidebarOpen && setIsExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center rounded-md py-2 text-sm font-medium transition-colors",
            isSidebarOpen ? "px-3 justify-between" : "justify-center px-0",
            isExpanded
              ? "bg-screen-background text-default-font"
              : "text-subtext-color hover:bg-screen-background hover:text-default-font",
          )}
          title={isSidebarOpen ? undefined : route.label}
        >
          <div
            className={cn(
              "flex items-center",
              isSidebarOpen ? "gap-3" : "justify-center",
            )}
          >
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
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={route.path}
        className={({ isActive }) =>
          cn(
            "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
            isSidebarOpen ? "px-3 gap-3" : "justify-center px-0",
            isActive
              ? "bg-brand-highlight-bg text-brand-highlight-text"
              : "text-subtext-color hover:bg-screen-background hover:text-default-font",
          )
        }
        title={isSidebarOpen ? undefined : route.label}
      >
        {route.icon && <route.icon className="h-5 w-5" />}
        {isSidebarOpen && route.label}
      </NavLink>
    </li>
  );
}
