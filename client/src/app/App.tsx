import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppLayout } from "@app/AppLayout/AppLayout";
import { AppRoutes } from "@app/routes";
import "@patternfly/react-core/dist/styles/base.css";
import { AuthProvider } from "@app/Auth/AuthContext";
import { ProtectedRoute } from "@app/Auth/ProtectedRoute";
import { AppLoginPage } from "@app/Login/LoginPage";
import "@app/App.css";

const App: React.FunctionComponent = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AppLoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
