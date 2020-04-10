import { DispatchProp } from "react-redux";
import { store } from "..";
import {
  CHANGE_TITLE_EPIC,
  CHANGE_SAVING_STATUS_EPIC,
  MERGE_CONTENT_EPIC,
  SET_CONTENT,
  UNREAD_FILE_EPIC
} from "../store/actions";
import { FUZZY } from "./config";
const { ipcRenderer = null } = window.require ? window.require("electron") : {};

export function initLisenter({ dispatch }: DispatchProp) {
  if (!ipcRenderer) {
    return;
  }
  ipcRenderer.on(
    "readed",
    (event: any, param: { filePath: string; content: string }) => {
      const { filePath, content: payload } = param;
      dispatch({ type: CHANGE_TITLE_EPIC, payload: filePath });
      dispatch({ type: SET_CONTENT, payload });
    }
  );

  // 卸载文件
  ipcRenderer.on("unread-file", () => dispatch({ type: UNREAD_FILE_EPIC }));
  //   扫描项目完成
  ipcRenderer.on("scan-finish", (e: any, message: any) => {
    dispatch({ type: CHANGE_TITLE_EPIC });
    dispatch({ type: SET_CONTENT, payload: message });
  });

  //   合并项目时内容读取完成
  ipcRenderer.on(
    "merge-file-readed",
    (_e: any, { content }: { [index: string]: string }) =>
      dispatch({ type: MERGE_CONTENT_EPIC, payload: content })
  );
  // 从菜单栏接受保存文件的事件
  ipcRenderer.on("save-file", () => {
    // console.log("renderer save-file");
    dispatch({ type: CHANGE_SAVING_STATUS_EPIC, payload: true });
    const { ContentReducer } = store.getState();
    ContentReducer.headers["Content-Type"] = [
      "text/plain",
      "charset=" + ContentReducer.charset
    ].join(";");
    ipcRenderer.send("save-file", {
      filePath: localStorage.getItem("filePath"),
      content: ContentReducer
    });
    ipcRenderer.once("save-file-complete", () => {
      dispatch({ type: CHANGE_SAVING_STATUS_EPIC, payload: false });
    });
  });

  // flag 表示是否只导出未翻译部分
  ipcRenderer.on("export-file", (_e: any, flag: boolean) => {
    dispatch({ type: CHANGE_SAVING_STATUS_EPIC, payload: true });
    const { ContentReducer } = store.getState();
    if (flag) {
      const obj = ContentReducer.translations[""];
      const content = Object.keys(obj)
        .filter(f => {
          const {
            msgstr: [first] = [],
            comments: { flag = undefined } = {}
          } = obj[f];
          return !first || flag === FUZZY;
        })
        .reduce((pre, next) => ({ ...pre, [next]: obj[next] }), {});
      ipcRenderer.send("export-file", {
        content: {
          ...ContentReducer,
          translations: {
            "": content
          }
        }
      });
    } else {
      ipcRenderer.send("export-file", { content: ContentReducer });
    }
    ipcRenderer.once("export-file-complete", () => {
      dispatch({ type: CHANGE_SAVING_STATUS_EPIC, payload: false });
    });
  });

  return () => ipcRenderer.removeAllListeners();
}
