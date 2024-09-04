import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from './AppLayout/AppLayout';
import './App.css';

const App: React.FunctionComponent = () => (
  <Router>
    <AppLayout>
      Dashboard
    </AppLayout>
  </Router>
);

export default App;