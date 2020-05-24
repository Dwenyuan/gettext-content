import { Grid, makeStyles, Paper, Snackbar } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
import { PoBean } from "gettext-lib";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DataTable } from "../components/data.table";
import { HelperList } from "../components/helper.list";
import { mapTanslation } from "../store/mapStateToProps";
import { GlobalStatusBean } from "../bean/global_status.bean";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 8,
    height: "100%",
    background: grey[300],
  },
  split: {
    // borderStyle: "solid",
    // borderWidth: 1,
    // padding: 5
  },
  main: {},
  helper: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
interface IProps
  extends PoBean,
    GlobalStatusBean,
    RouteComponentProps,
    DispatchProp {}
function TranslatorPage(props: IProps) {
  const classes = useStyles();
  const { history, translations, saving } = props;
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!isEmpty(translations)) {
      history.push("/translator");
    } else {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translations]);
  useEffect(() => setOpen(true), [saving]);
  return (
    <Grid className={classes.root} container direction="row">
      <Grid
        item
        container
        style={{ paddingRight: 5 }}
        direction="column"
        justify="space-around"
        xs={8}
      >
        <Grid className={classes.split} style={{ flex: 1, overflow: "auto" }}>
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert elevation={6} variant="filled" severity="success">
              {saving ? "保存中" : "保存成功"}
            </Alert>
          </Snackbar>
          <Paper style={{ padding: 5 }}>
            <DataTable></DataTable>
          </Paper>
        </Grid>
        {/* <Grid className={classes.split} style={{ height: 260 }}>
          <Paper style={{ padding: 5 }}>
            <TranslatorArea></TranslatorArea>
          </Paper>
        </Grid> */}
      </Grid>
      <Grid style={{ paddingLeft: 5 }} item xs={4}>
        <HelperList></HelperList>
      </Grid>
    </Grid>
  );
}

export default withRouter(
  connect(
    ({
      ContentReducer,
      GlobalStatus,
    }: {
      ContentReducer: PoBean;
      GlobalStatus: GlobalStatusBean;
    }) => ({
      ...ContentReducer,
      ...GlobalStatus,
    })
  )(TranslatorPage)
);
