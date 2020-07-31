import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import {
  Build as BuildIcon,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Reorder as ReorderIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { connect, DispatchProp } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ImportPage } from "./pages/import-page";
import TranslatorPage from "./pages/translator-page";
import { initLisenter } from "./services/lisenter";
import { RootReducer } from "./store/reduce";

const { ipcRenderer = null } = window.require ? window.require("electron") : {};

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 0,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
  })
);

interface IProps extends DispatchProp, RootReducer {}
function App({ dispatch, ContentReducer, TitleReducer, GlobalStatus }: IProps) {
  const { headers, translations, charset } = ContentReducer;
  const { title } = TitleReducer;
  const { saving } = GlobalStatus;
  const [openDraw, setOpenDraw] = useState(false);
  const theme = useTheme();
  const classes = useStyles();
  useEffect(() => {
    const destory = initLisenter({ dispatch });
    return destory;
  }, [charset, dispatch, headers, translations]);
  useEffect(() => {
    //TODO  如果有缓存的文件路径，就直接读取, 这里还要添加以下校验操作,如果文件不存在的话就清除掉缓存
    const filePath = localStorage.getItem("filePath");
    if (filePath) {
      ipcRenderer.send("open-file", filePath);
    }
    return () => ipcRenderer.removeAllListeners();
  }, []);
  return (
    <div className={classes.root}>
      <Drawer
        className={clsx({
          [classes.drawerOpen]: openDraw,
          [classes.drawerClose]: !openDraw,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDraw,
            [classes.drawerClose]: !openDraw,
          }),
        }}
        variant="permanent">
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setOpenDraw(false)}>
            {/* {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />} */}
            {openDraw ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>hello</ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText>world</ListItemText>
          </ListItem>
          <ListItem button onClick={() => setOpenDraw((pre) => !pre)}>
            <ListItemIcon>
              <ReorderIcon />
            </ListItemIcon>
            <ListItemText>swtich</ListItemText>
          </ListItem>
        </List>
      </Drawer>

      <Router basename="/" hashType="hashbang">
        <Helmet>
          <meta charSet="utf-8" />
          <title>
            {title} {saving ? "saving..." : ""}
          </title>
        </Helmet>
        <Switch>
          <Route exact path="/" component={ImportPage}></Route>
          <Route exact path="/translator" component={TranslatorPage}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default connect(
  ({ ContentReducer, TitleReducer, GlobalStatus }: RootReducer) => ({
    ContentReducer,
    TitleReducer,
    GlobalStatus,
  })
)(App);
