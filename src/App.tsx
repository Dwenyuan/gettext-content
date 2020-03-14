import React, { useEffect } from "react";
import { connect, DispatchProp } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
import { UNREAD_FILE_EPIC } from "./store/actions";
import { mapTanslation } from "./store/mapStateToProps";
import { TranslationBean } from "./bean/content.bean";
const { ipcRenderer = null } = window.require ? window.require("electron") : {};

interface IProps extends DispatchProp, TranslationBean {}
function App({ dispatch, headers, translations, charset }: IProps) {
  useEffect(() => {
    ipcRenderer.on("unread-file", () => dispatch({ type: UNREAD_FILE_EPIC }));
    ipcRenderer.on("save-file", () => {
      console.log("renderer save-file");
      ipcRenderer.send("save-file", {
        filePath: localStorage.getItem("filePath"),
        content: { headers, translations, charset }
      });
    });
    const filePath = localStorage.getItem("filePath");
    if (filePath) {
      ipcRenderer.send("open-file", filePath);
    }
    return () => ipcRenderer.removeAllListeners();
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
