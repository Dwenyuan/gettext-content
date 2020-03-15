import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { sourceLanguage, Translation } from "../bean/content.bean";
import { BaiduTransResultBean } from "../bean/trans_result.bean";
import { mergeFile, rescanProject } from "../services/file.services";
import { Lang, translatorByBaidu } from "../services/translator.service";
import { CHANGE_CONTENT_EPIC, PRE_TRANSLATOR } from "../store/actions";
import { RootReducer } from "../store/reduce";
import { FUZZY } from "../services/config";

const useStyles = makeStyles({
  card: {
    marginBottom: 5
  },
  translator: {
    marginTop: 5
  },
  rootBtn: {
    width: "100%",
    marginTop: 10
  }
});
interface IProps extends RootReducer, DispatchProp {}

export const HelperList = connect((root: RootReducer) => root)(
  (props: IProps) => {
    const {
      SelectedTranslation: { selectedId = undefined } = {},
      ContentReducer: {
        headers: { Language = "zh" },
        translations
      },
      dispatch
    } = props || {};
    const classes = useStyles();
    const [baiduTrans = {}, setBaiduTrans] = useState<BaiduTransResultBean>();
    const [selected, setSelected] = useState<Translation | undefined>();
    const {
      msgid,
      msgstr: [first] = [],
      comments: { reference = "", flag = undefined } = {}
    } = selected! || {};
    useEffect(() => {
      const selectTranslation = (translations[""] || {})[selectedId!];
      setSelected(selectTranslation);
    }, [selectedId, translations]);
    useEffect(() => {
      if (msgid) {
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
      }
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
              <FormControlLabel
                control={
                  <Switch
                    disabled={!msgid}
                    checked={flag === FUZZY}
                    onChange={e =>
                      dispatch({
                        type: CHANGE_CONTENT_EPIC,
                        payload: {
                          key: msgid,
                          value: first,
                          fuzzy: e.target.checked
                        }
                      })
                    }
                    color="secondary"
                  />
                }
                label="标记需要处理"
              />
              <Button
                onClick={preTranslator}
                className={classes.rootBtn}
                variant="contained"
                color="primary"
              >
                预翻译
              </Button>
              <Button
                onClick={mergeFile}
                className={classes.rootBtn}
                variant="contained"
                color="primary"
              >
                合并已有翻译文件
              </Button>
              <Button
                onClick={rescanProject}
                className={classes.rootBtn}
                variant="contained"
                color="primary"
              >
                重新扫描项目
              </Button>
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="subtitle1" color="primary">
              {msgid}
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              百度翻译
            </Typography>
            <Typography
              component={"div"}
              className={classes.translator}
              variant="body1"
              color="initial"
            >
              <List component={"div"} dense>
                {trans_result.map(({ src, dst }) => (
                  <ListItem component={"span"} key={src} button>
                    <ListItemText
                      primary={dst}
                      onClick={() =>
                        dispatch({
                          type: CHANGE_CONTENT_EPIC,
                          payload: { key: msgid, value: dst, fuzzy: true }
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
