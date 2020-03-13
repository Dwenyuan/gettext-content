import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store";
import { SET_CONTENT } from "./store/actions";
const { ipcRenderer } = window.require("electron");

const store = configureStore();
ipcRenderer.on("readed", (event: any, content: string) =>
  store.dispatch({ type: SET_CONTENT, payload: content })
);
// ipcRenderer.on("readed", console.log);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
