const { ipcRenderer = null } = window.require ? window.require("electron") : {};
/**
 * 导入一个csv或者json文件，合并到当前po文件
 */
export function mergeFile() {
  ipcRenderer.send("merge-file");

  ipcRenderer.once("merge-file-complate", (_e: any, result: string) => {
    //   TODO:
  });
}

/**
 * 重新扫描项目
 */
export function rescanProject() {
  ipcRenderer.send("scan-files");
  // TODO:
}

export function scanProject() {
  ipcRenderer.send("scan-files");
}
