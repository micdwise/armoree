import React from "react";
import logo from "@app/logo.svg";
import "@app/App.css";

import { Brand } from "@patternfly/react-core";
import pfLogo from "../node_modules/@patternfly/react-core/dist/styles/assets/images/logo__pf--reverse--base.png";

export const BrandBasic: React.FunctionComponent = () => (
  <Brand
    src={pfLogo}
    alt="Patternfly Logo"
    widths={{ default: "200px", md: "400px", xl: "600px" }}
  />
);

function App() {
  return (
    <div className="App">
      <BrandBasic />
    </div>
  );
}

export default App;
