import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { connect, DispatchProp } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
import { initLisenter } from "./services/lisenter";
import { RootReducer } from "./store/reduce";
const { ipcRenderer = null } = window.require ? window.require("electron") : {};

interface IProps extends DispatchProp, RootReducer {}
function App({ dispatch, ContentReducer, TitleReducer, GlobalStatus }: IProps) {
  const { headers, translations, charset } = ContentReducer;
  const { title } = TitleReducer;
  const { saving } = GlobalStatus;
  useEffect(() => {
    const destory = initLisenter({ dispatch });
    return destory;
  }, [charset, dispatch, headers, translations]);
  useEffect(() => {
    //TODO  如果有缓存的文件路径，就直接读取, 这里还要添加以下校验操作,如果文件不存在的话就清除掉缓存
    const filePath = localStorage.getItem("filePath");
    if (filePath) {
      ipcRenderer.send("open-file", filePath);
    }
    return () => ipcRenderer.removeAllListeners();
  }, []);
  return (
    <Router basename="/" hashType="hashbang">
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {title} {saving ? "saving..." : ""}
        </title>
      </Helmet>
      <Switch>
        <Route exact path="/" component={ImportPage}></Route>
        <Route exact path="/translator" component={TranslatorPage}></Route>
      </Switch>
    </Router>
  );
}

export default connect(
  ({ ContentReducer, TitleReducer, GlobalStatus }: RootReducer) => ({
    ContentReducer,
    TitleReducer,
    GlobalStatus
  })
)(App);
