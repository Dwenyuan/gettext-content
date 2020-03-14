import {
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { Translation } from "../bean/content.bean";
import { BaiduTransResultBean } from "../bean/trans_result.bean";
import { translatorByBaidu } from "../services/translator.service";
import { RootReducer } from "../store/reduce";
import { PRE_TRANSLATOR } from "../store/actions";

const useStyles = makeStyles({
  card: {
    marginBottom: 5
  },
  translator: {
    marginTop: 5
  }
});
interface IProps extends Translation, DispatchProp {}

export const HelperList = connect(
  ({ SelectedTranslation }: RootReducer) => SelectedTranslation
)((props: IProps) => {
  const { msgid = "", msgstr, comments: { reference = "" } = {}, dispatch } =
    props || {};
  const classes = useStyles();
  const [baiduTrans = {}, setBaiduTrans] = useState<BaiduTransResultBean>();
  useEffect(() => {
    translatorByBaidu({ query: msgid, from: "en", to: "zh" })
      .then(res => res.json<BaiduTransResultBean>())
      .then((content: BaiduTransResultBean) => {
        console.log("content", content);
        setBaiduTrans(content);
      });
  }, [msgid]);
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
                  <ListItemText primary={dst} />
                </ListItem>
              ))}
            </List>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">应用</Button>
        </CardActions>
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
});
