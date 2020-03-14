import React, { useEffect } from "react";
import { connect, DispatchProp } from "react-redux";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import { TranslationBean } from "./bean/content.bean";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
import { initLisenter } from "./services/lisenter";
import { mapTanslation } from "./store/mapStateToProps";
const { ipcRenderer = null } = window.require ? window.require("electron") : {};

interface IProps extends DispatchProp, TranslationBean {}
function App({ dispatch, headers, translations, charset }: IProps) {
  useEffect(() => {
    const destory = initLisenter({ dispatch });
    return destory;
  }, [charset, dispatch, headers, translations]);
  useEffect(() => {
    //   如果有缓存的文件路径，就直接读取
    const filePath = localStorage.getItem("filePath");
    if (filePath) {
      ipcRenderer.send("open-file", filePath);
    }
    return () => ipcRenderer.removeAllListeners();
  }, []);
  return (
    <Router basename="/" hashType="hashbang">
      <Switch>
        <Route exact path="/" component={ImportPage}></Route>
        <Route exact path="/translator" component={TranslatorPage}></Route>
      </Switch>
    </Router>
  );
}

export default connect(mapTanslation)(App);
