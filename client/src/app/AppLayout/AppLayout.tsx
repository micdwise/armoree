import * as React from "react";
import { Sidebar } from "@components/Sidebar";
import { Header } from "@components/Header";
import { routes } from "@app/routes";
import { cn } from "../../lib/utils";

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-screen-background">
      {/* Mobile sidebar backdrop */}
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 h-full w-full bg-black/30 backdrop-blur-sm transition-all duration-300 lg:hidden",
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
        routes={routes}
        className={cn("lg:block z-40", sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-screen-background p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export { AppLayout };
