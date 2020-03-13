import React, { useEffect, useState } from "react";
import { Grid, Button, ButtonProps } from "@material-ui/core";
import { mapTanslation } from "../store/mapStateToProps";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { TranslationBean } from "../bean/content.bean";
import { isEmpty } from "lodash";
const { ipcRenderer } = window.require
  ? window.require("electron")
  : { ipcRenderer: null };
const btnProps: ButtonProps = {
  size: "large",
  variant: "contained",
  style: {
    minWidth: 340
  }
};
interface IProps extends TranslationBean, RouteComponentProps, DispatchProp {}
export function ImportPageInner(props: IProps) {
  const { charset, header, translations, history } = props;
  console.log(props);

  const [path, setPath] = useState();
  useEffect(() => {
    if (!isEmpty(translations)) {
      history.push("/translator");
    } else {
      history.push("/");
    }
  }, [history, translations]);
  useEffect(() => {
    ipcRenderer.on(
      "selected-dir",
      (e: any, p: React.SetStateAction<undefined>) => setPath(p)
    );
  }, []);
  return (
    <Grid
      container
      style={{ minHeight: "80vh" }}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Button
        {...btnProps}
        onClick={() => ipcRenderer.send("open-dir")}
        color="primary"
      >
        选择文件夹
      </Button>
      <p>{path}</p>
      <Button {...btnProps} color="secondary">
        打开PO文件
      </Button>
    </Grid>
  );
}
export const ImportPage = withRouter(connect(mapTanslation)(ImportPageInner));
