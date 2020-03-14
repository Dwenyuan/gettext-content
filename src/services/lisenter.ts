import { store } from "..";
import {
  MERGE_CONTENT_EPIC,
  SET_CONTENT,
  UNREAD_FILE_EPIC
} from "../store/actions";
import { DispatchProp } from "react-redux";
const { ipcRenderer = null } = window.require ? window.require("electron") : {};

export function initLisenter({ dispatch }: DispatchProp) {
  ipcRenderer.on(
    "readed",
    (event: any, param: { filePath: string; content: string }) => {
      const { filePath, content: payload } = param;
      localStorage.setItem("filePath", filePath);
      dispatch({ type: SET_CONTENT, payload });
    }
  );

  // 卸载文件
  ipcRenderer.on("unread-file", () => dispatch({ type: UNREAD_FILE_EPIC }));
  //   扫描项目完成
  ipcRenderer.on("scan-finish", (e: any, message: any) => {
    dispatch({ type: SET_CONTENT, payload: message });
  });

  //   合并项目时内容读取完成
  ipcRenderer.on(
    "merge-file-readed",
    (e: any, { content }: { [index: string]: string }) =>
      dispatch({ type: MERGE_CONTENT_EPIC, payload: content })
  );
  // 从菜单栏接受保存文件的事件
  ipcRenderer.on("save-file", () => {
    console.log("renderer save-file");
    const { ContentReducer } = store.getState();
    ContentReducer.headers["Content-Type"] = [
      "text/plain",
      "charset=" + ContentReducer.charset
    ].join(";");
    ipcRenderer.send("save-file", {
      filePath: localStorage.getItem("filePath"),
      content: ContentReducer
    });
  });

  return () => ipcRenderer.removeAllListeners();
}
