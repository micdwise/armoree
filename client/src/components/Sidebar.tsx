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
}: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-gray-200 bg-white text-gray-900 transition-all duration-300 ease-in-out lg:static overflow-hidden",
        isOpen
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full lg:w-16 lg:translate-x-0",
        className,
      )}
      {...props}
    >
      <div className={cn(
        "flex h-16 items-center border-b border-gray-200 transition-all duration-300",
        isOpen ? "justify-between px-4" : "justify-center lg:px-0"
      )}>
        <span className={cn(
          "text-xl font-bold text-gray-900 transition-opacity duration-200 whitespace-nowrap",
          isOpen ? "opacity-100" : "opacity-0 lg:hidden"
        )}>
          Armoree
        </span>
        {/* Show a mini logo or icon when collapsed if needed, for now just hiding text to prevent overflow */}
        {!isOpen && <span className="hidden lg:block font-bold text-xl">A</span>}

        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-900"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {routes.map((route, idx) => (
            <SidebarItem
              key={idx}
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
}: {
  route: any;
  currentPath: string;
  isSidebarOpen: boolean;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isActive = route.path === currentPath;
  const hasChildren = route.routes && route.routes.length > 0;

  // Auto expand if child is active and sidebar is open
  React.useEffect(() => {
    if (isSidebarOpen && hasChildren && route.routes.some((r: any) => r.path === currentPath)) {
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
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
          title={!isSidebarOpen ? route.label : undefined}
        >
          <div className={cn("flex items-center", isSidebarOpen ? "gap-3" : "justify-center")}>
            {route.icon && <route.icon className="h-5 w-5" />}
            {isSidebarOpen && <span>{route.label}</span>}
          </div>
          {isSidebarOpen && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isSidebarOpen && isExpanded && (
          <ul className="mt-1 space-y-1 pl-4">
            {route.routes.map((childRoute: any, idx: number) => (
              <SidebarItem
                key={idx}
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
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          )
        }
        title={!isSidebarOpen ? route.label : undefined}
      >
        {route.icon && <route.icon className="h-5 w-5" />}
        {isSidebarOpen && route.label}
      </NavLink>
    </li>
  );
}
