import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Settings, Bell, Sun, Moon, Laptop } from "lucide-react";
import { Button } from "./Button";
import { useTheme } from "./ThemeContext";
import { UserMenu } from "./UserMenu";

interface IHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<IHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-border bg-default-background px-4 shadow-sm lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-subtext-color focus:outline-none hover:text-default-font"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="lg:hidden">
          <h1 className="text-xl font-semibold text-default-font">Armoree</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="link"
          aria-label="Toggle Theme"
          onClick={() => {
            if (theme === "light") setTheme("dark");
            else if (theme === "dark") setTheme("system");
            else setTheme("light");
          }}
        >
          {theme === "light" && (
            <Sun className="h-5 w-5 text-subtext-color hover:text-default-font" />
          )}
          {theme === "dark" && (
            <Moon className="h-5 w-5 text-subtext-color hover:text-default-font" />
          )}
          {theme === "system" && (
            <Laptop className="h-5 w-5 text-subtext-color hover:text-default-font" />
          )}
        </Button>
        <Button variant="link" aria-label="Notifications">
          <Bell className="h-5 w-5 text-subtext-color hover:text-default-font" />
        </Button>
        <Button variant="link" aria-label="Settings">
          <Settings className="h-5 w-5 text-subtext-color hover:text-default-font" />
        </Button>
        <div className="border-t border-neutral-border p-4 md:border-t-0 md:p-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
