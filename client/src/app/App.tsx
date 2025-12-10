import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../components/ThemeContext";
import { router } from "@app/routes";
import { AuthProvider } from "@app/Auth/AuthContext";

const App: React.FunctionComponent = () => (
  <ThemeProvider defaultTheme="system" storageKey="armoree-ui-theme">
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
