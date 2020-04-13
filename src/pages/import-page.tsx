import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField
} from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PoBean } from "../bean/content.bean";
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
interface IProps extends PoBean, RouteComponentProps, DispatchProp {}
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
  const [language, setLanguage] = useState<string>("ko");
  const [keywordsList, setKeywordsList] = useState<string>("__");
  const [lastTranslator, setLastTranslator] = useState<string>(
    "dimitri@staritgp.com"
  );
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    ipcRenderer.send("scan-files", {
      transformHeaders: {
        Language: language,
        "X-Poedit-KeywordsList": keywordsList,
        "Last-Translator": lastTranslator
      }
    });
  }
  return (
    <Grid
      container
      style={{ minHeight: "80vh" }}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Button {...btnProps} onClick={() => setVisible(true)} color="primary">
        扫描文件夹
      </Button>
      <br />
      <Button
        {...btnProps}
        onClick={() => ipcRenderer.send("open-file")}
        color="secondary"
      >
        打开PO文件
      </Button>
      <Dialog
        open={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">配置项</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              required
              select
              variant="filled"
              label="语言选择"
              name="language"
              fullWidth
              value={language}
              onChange={e => setLanguage(e.target.value as string)}
            >
              <MenuItem value="zh">中文</MenuItem>
              <MenuItem value="ko">韩文</MenuItem>
              <MenuItem value="en">英语</MenuItem>
            </TextField>
            <TextField
              autoFocus
              required
              variant="filled"
              multiline
              rows={4}
              value={keywordsList}
              onChange={e => setKeywordsList(e.target.value as string)}
              margin="dense"
              id="keywordsList"
              name="keywordsList"
              label="方法名,换行表示多个"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              value={lastTranslator}
              onChange={e => setLastTranslator(e.target.value as string)}
              id="lastTranslator"
              name="lastTranslator"
              label="最后翻译人"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisible(false)} color="primary">
              取消
            </Button>
            <Button type="submit" color="primary">
              提交
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
}
export const ImportPage = withRouter(connect(mapTanslation)(ImportPageInner));
