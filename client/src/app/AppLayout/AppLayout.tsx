import * as React from "react";
import { Sidebar } from "../../components/Sidebar";
import { routes } from "@app/routes";
import { Menu, LogOut, Settings, Bell } from "lucide-react";
import { Button } from "../../components/Button";

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        routes={routes}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 lg:hidden">Armoree</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="link" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Button>
            <Button variant="link" aria-label="Settings">
              <Settings className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Button>
            {/* About Modal placeholder or actual component integration if simple */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export { AppLayout };
