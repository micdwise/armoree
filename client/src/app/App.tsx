import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../components/ThemeContext";
import { router } from "@app/routes";

const App: React.FunctionComponent = () => (
  <ThemeProvider defaultTheme="system" storageKey="armoree-ui-theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
