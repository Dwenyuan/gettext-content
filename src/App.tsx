import React, { useEffect } from "react";
import { connect, DispatchProp } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { TranslationBean } from "./bean/content.bean";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
import { initLisenter } from "./services/lisenter";
import { mapTanslation } from "./store/mapStateToProps";

interface IProps extends DispatchProp, TranslationBean {}
function App({ dispatch, headers, translations, charset }: IProps) {
  useEffect(() => {
    const destory = initLisenter({ dispatch });
    return destory;
  }, [charset, dispatch, headers, translations]);
  return (
    <Router basename="/" hashType="hashbang">
      <Switch>
        <Route exact path="/translator" component={TranslatorPage}></Route>
        <Route path="/" component={ImportPage}></Route>
      </Switch>
    </Router>
  );
}

export default connect(mapTanslation)(App);
