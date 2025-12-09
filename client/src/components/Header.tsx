import * as React from "react";
import { Menu, LogOut, Settings, Bell } from "lucide-react";
import { Button } from "./Button";

interface IHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<IHeaderProps> = ({
    sidebarOpen,
    setSidebarOpen,
}) => {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-500 focus:outline-none hover:text-gray-700"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 lg:hidden">
                    Armoree
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="link" aria-label="Notifications">
                    <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </Button>
                <Button variant="link" aria-label="Settings">
                    <Settings className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </Button>
            </div>
        </header>
    );
};
