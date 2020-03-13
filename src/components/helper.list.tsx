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
  const { msgid = "", msgstr, comments: { reference = "" } = {} } = props || {};
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
  return (
    <React.Fragment>
      <Paper hidden={!msgid} style={{ padding: 5 }}>
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
              className={classes.translator}
              variant="body1"
              color="initial"
            >
              <List dense>
                {trans_result.map(({ src, dst }) => (
                  <ListItem button>
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
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              bing翻译
            </Typography>
            <Typography
              className={classes.translator}
              variant="body1"
              color="initial"
            >
              bing翻译
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">应用</Button>
          </CardActions>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              谷歌翻译
            </Typography>
            <Typography
              className={classes.translator}
              variant="body1"
              color="initial"
            >
              bing翻译
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
                <Typography variant="caption" display="block" gutterBottom>
                  {v}
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}
      </Paper>
    </React.Fragment>
  );
});
