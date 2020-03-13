import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <ImportPage />
        </Route>
        <Route path="/translator">
          <TranslatorPage />
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    </Router>
  );
}

export default App;
