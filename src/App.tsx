import { Grid, makeStyles, Paper } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import { DataTable } from "./components/data.table";
import { HelperList } from "./components/helper.list";
import { TranslatorArea } from "./components/translator.area";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 8,
    height: "100%",
    background: grey[300]
  },
  split: {
    // borderStyle: "solid",
    // borderWidth: 1,
    // padding: 5
  },
  main: {},
  helper: {},
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));
function App() {
  const classes = useStyles();
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
          <Paper style={{ padding: 5 }}>
            <DataTable></DataTable>
          </Paper>
        </Grid>
        <Grid className={classes.split} style={{ height: 260 }}>
          <Paper style={{ padding: 5 }}>
            <TranslatorArea></TranslatorArea>
          </Paper>
        </Grid>
      </Grid>
      <Grid style={{ paddingLeft: 5 }} item xs={4}>
        <HelperList></HelperList>
      </Grid>
    </Grid>
  );
}

export default App;
