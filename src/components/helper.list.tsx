import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { sourceLanguage } from "../bean/content.bean";
import { BaiduTransResultBean } from "../bean/trans_result.bean";
import { mergeFile, rescanProject } from "../services/file.services";
import { Lang, translatorByBaidu } from "../services/translator.service";
import { CHANGE_CONTENT_EPIC, PRE_TRANSLATOR } from "../store/actions";
import { RootReducer } from "../store/reduce";

const useStyles = makeStyles({
  card: {
    marginBottom: 5
  },
  translator: {
    marginTop: 5
  }
});
interface IProps extends RootReducer, DispatchProp {}

export const HelperList = connect((root: RootReducer) => root)(
  (props: IProps) => {
    const {
      SelectedTranslation: { msgid = "", comments: { reference = "" } = {} },
      ContentReducer: {
        headers: { Language = "zh" }
      },
      dispatch
    } = props || {};
    const classes = useStyles();
    const [baiduTrans = {}, setBaiduTrans] = useState<BaiduTransResultBean>();
    useEffect(() => {
      translatorByBaidu({
        query: msgid,
        from: sourceLanguage,
        to: Lang[Language]
      })
        .then(res => res.json<BaiduTransResultBean>())
        .then((content: BaiduTransResultBean) => {
          console.log("content", content);
          setBaiduTrans(content);
        });
    }, [Language, msgid]);
    const { trans_result = [] } = baiduTrans as BaiduTransResultBean;
    function preTranslator() {
      dispatch({ type: PRE_TRANSLATOR });
    }
    return (
      <React.Fragment>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="subtitle1" color="primary">
              <Button
                onClick={preTranslator}
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
              >
                预翻译
              </Button>
              <Button
                onClick={mergeFile}
                variant="contained"
                color="primary"
                style={{ width: "100%", marginTop: 10 }}
              >
                合并已有翻译文件
              </Button>
              <Button
                onClick={rescanProject}
                variant="contained"
                color="primary"
                style={{ width: "100%", marginTop: 10 }}
              >
                重新扫描项目
              </Button>
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="subtitle1" color="primary">
              {msgid ? msgid : <Button onClick={preTranslator}>预翻译</Button>}
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              百度翻译
            </Typography>
            <Typography
              className={classes.translator}
              variant="body1"
              color="initial"
            >
              <List dense>
                {trans_result.map(({ src, dst }) => (
                  <ListItem key={src} button>
                    <ListItemText
                      primary={dst}
                      onClick={() =>
                        dispatch({
                          type: CHANGE_CONTENT_EPIC,
                          payload: { key: msgid, value: dst }
                        })
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Typography>
          </CardContent>
        </Card>
        {reference && reference.split("\n").length > 0 && (
          <Card>
            <CardContent>
              {reference.split("\n").map(v => (
                <Typography
                  key={v}
                  variant="caption"
                  display="block"
                  gutterBottom
                >
                  {v}
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}
      </React.Fragment>
    );
  }
);
