import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
function App() {
  return (
    <Router basename="/" hashType="hashbang">
      <Switch>
        <Route exact path="/translator" component={TranslatorPage}></Route>
        <Route path="/" component={ImportPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;
