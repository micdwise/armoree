import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    routes: any[];
}

export function Sidebar({ isOpen, onClose, routes, className, ...props }: SidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}
            {...props}
        >
            <div className="flex h-16 items-center justify-between px-4 bg-gray-900 border-b border-gray-800">
                <span className="text-xl font-bold">Armoree</span>
                <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {routes.map((route, idx) => (
                        <SidebarItem key={idx} route={route} currentPath={location.pathname} />
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

function SidebarItem({ route, currentPath }: { route: any; currentPath: string }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const isActive = route.path === currentPath;
    const hasChildren = route.routes && route.routes.length > 0;

    // Auto expand if child is active
    React.useEffect(() => {
        if (hasChildren && route.routes.some((r: any) => r.path === currentPath)) {
            setIsExpanded(true);
        }
    }, [currentPath, hasChildren, route.routes]);


    if (!route.label) return null;

    if (hasChildren) {
        return (
            <li>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white",
                        isExpanded && "bg-gray-800 text-white"
                    )}
                >
                    <div className="flex items-center gap-3">
                        {/* Lucide icons need to be mapped if route.icon is a component */}
                        {/* For simplicity assuming route.icon is not used or handled elsewhere for now, or we can render it if it's a component */}
                        {/* {route.icon && <route.icon className="h-5 w-5" />} */}
                        <span>{route.label}</span>
                    </div>
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </button>
                {isExpanded && (
                    <ul className="mt-1 space-y-1 pl-4">
                        {route.routes.map((childRoute: any, idx: number) => (
                            <SidebarItem key={idx} route={childRoute} currentPath={currentPath} />
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
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )
                }
            >
                {/* {route.icon && <route.icon className="h-5 w-5" />} */}
                {route.label}
            </NavLink>
        </li>
    );
}
