import {
  FormControlLabel,
  makeStyles,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@material-ui/core";
import orange from "@material-ui/core/colors/orange";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { Translation } from "../bean/content.bean";
import { FUZZY } from "../services/config";
import { CHANGE_CONTENT_EPIC, SELECT_ROW_EPIC } from "../store/actions";
import { RootReducer } from "../store/reduce";
const useStyle = makeStyles({
  container: {
    height: "calc(100vh - 76px)"
  }
});
interface IProps extends RootReducer, DispatchProp {}
export function DataTableInner(props: IProps) {
  const {
    ContentReducer: { translations },
    SelectedTranslation: { selectedId },
    dispatch
  } = props;

  const classes = useStyle();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  // 过滤功能的关键字
  const [keyword, setKeyword] = useState("");
  const [onlyTodo, setOnlyTodo] = useState(false);
  const list = translations[""];
  const keys = Object.keys(list || {});
  useEffect(() => {
    setTotal(keys.filter(key => !!key).length);
  }, [keys]);
  useEffect(() => {
    setTotal(getFiletedList({ keys, list, keyword, onlyTodo }).length);
  }, [keys, keyword, list, onlyTodo]);
  const fillCount = keys
    .filter(key => !!key)
    .filter(f => {
      const { msgstr: [first] = [] } = list[f] || {};
      return !!first;
    }).length;

  function tableBody() {
    return getFiletedList({ keys, list, keyword, onlyTodo })
      .slice(current * pageSize, current * pageSize + pageSize)
      .map(key => {
        const { msgstr: [first] = [], comments: { flag = undefined } = {} } =
          list[key] || {};
        return (
          <TableRow
            style={{
              backgroundColor: flag === FUZZY || !first ? orange[50] : ""
            }}
            selected={selectedId === key}
            hover={true}
            key={key}
            onClick={() => dispatch({ type: SELECT_ROW_EPIC, payload: key })}
          >
            <TableCell>{key}</TableCell>
            <TableCell>
              <TextField
                fullWidth
                onChange={onChange({ dispatch }, key)}
                id="standard-basic"
                multiline
                value={first}
              />
            </TableCell>
          </TableRow>
        );
      });
  }
  return (
    <React.Fragment>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                源文件 ({fillCount}/{keys.length})
                <TextField
                  style={{ marginLeft: 15 }}
                  size="small"
                  variant="standard"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                ></TextField>
              </TableCell>
              <TableCell>
                翻译文件
                <FormControlLabel
                  style={{ marginLeft: 15, fontSize: 12 }}
                  control={
                    <Switch
                      size="small"
                      checked={onlyTodo}
                      onChange={e => setOnlyTodo(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="仅显示需要处理的翻译"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableBody()}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 30]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={current}
        onChangePage={(e, index) => setCurrent(index)}
        onChangeRowsPerPage={e => setPageSize(parseInt(e.target.value))}
      />
    </React.Fragment>
  );
}
/**
 * 获取过滤之后符合要求的列表结果
 *
 */
function getFiletedList(param: {
  keys: string[];
  list: { [index: string]: Translation };
  keyword: string;
  onlyTodo: boolean;
}) {
  const { keys, list, keyword = "", onlyTodo } = param;
  return keys
    .filter(key => !!key)
    .filter(key => {
      const {
        msgstr: [first] = [],
        comments: { flag = undefined } = {}
      } = list[key];
      if (onlyTodo) {
        return !first || flag === FUZZY;
      } else {
        return true;
      }
    })
    .filter(f =>
      new RegExp(keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i").test(
        f
      )
    );
}
function onChange({ dispatch }: DispatchProp, key: string) {
  return ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: CHANGE_CONTENT_EPIC, payload: { key, value } });
  };
}

export const DataTable = connect<any, any, any, RootReducer>(
  (root: RootReducer) => root
)(DataTableInner);
