import { UNREAD_FILE_EPIC, MERGE_CONTENT_EPIC } from "../store/actions";
import { DispatchProp } from "react-redux";

const { ipcRenderer = null } = window.require ? window.require("electron") : {};

export function initLisenter({ dispatch }: DispatchProp) {
  // 卸载文件
  ipcRenderer.on("unread-file", () => dispatch({ type: UNREAD_FILE_EPIC }));
  //   扫描项目完成
  ipcRenderer.on("scan-finish", (e: any, message: any) => {
    console.log(message);
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
    ipcRenderer.send("save-file", {
      filePath: localStorage.getItem("filePath"),
      content: { headers: {}, translations: {}, charset: "" }
    });
  });
  //   如果有缓存的文件路径，就直接读取
  const filePath = localStorage.getItem("filePath");
  if (filePath) {
    ipcRenderer.send("open-file", filePath);
  }
  return () => ipcRenderer.removeAllListeners();
}