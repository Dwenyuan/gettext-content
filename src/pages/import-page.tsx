import {
  Button,
  ButtonProps,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { TranslationBean } from "../bean/content.bean";
import { mapTanslation } from "../store/mapStateToProps";
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
  const { translations, history } = props;
  console.log(props);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isEmpty(translations)) {
      history.push("/translator");
    } else {
      history.push("/");
    }
  }, [history, translations]);

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
        onClick={() => ipcRenderer.send("scan-files")}
        color="primary"
      >
        扫描文件夹
      </Button>
      <br />
      <Button {...btnProps} onClick={() => setVisible(true)} color="secondary">
        打开PO文件
      </Button>
      <Dialog
        open={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisible(true)} color="primary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
export const ImportPage = withRouter(connect(mapTanslation)(ImportPageInner));
