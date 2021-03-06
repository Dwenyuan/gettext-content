import {
  Box,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Translation } from "gettext-lib";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { FUZZY } from "../services/config";
import { CHANGE_CONTENT_EPIC, SELECT_ROW_EPIC } from "../store/actions";
import { RootReducer } from "../store/reduce";
const useStyle = makeStyles({
  container: {
    height: "calc(100vh - 76px)",
  },
});
interface IProps extends RootReducer, DispatchProp {}
export function DataTableInner(props: IProps) {
  const {
    ContentReducer: { translations },
    SelectedTranslation: { selectedId = undefined } = {},
    dispatch,
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
    setTotal(keys.filter((key) => !!key).length);
  }, [keys]);
  useEffect(() => {
    setTotal(getFiletedList({ keys, list, keyword, onlyTodo }).length);
  }, [keys, keyword, list, onlyTodo]);
  const fillCount = keys
    .filter((key) => !!key)
    .filter((f) => {
      const { msgstr: [first] = [] } = list[f] || {};
      return !!first;
    }).length;

  function tableBody() {
    console.count("数据主体表格渲染次数");
    return getFiletedList({ keys, list, keyword, onlyTodo })
      .slice(current * pageSize, current * pageSize + pageSize)
      .map((key) => {
        const { msgstr: [first] = [], comments: { flag = undefined } = {} } =
          list[key] || {};
        const isFuzzy = flag === FUZZY || !first;
        return (
          <TableRow
            selected={selectedId === key}
            hover={true}
            key={key}
            onClick={() => dispatch({ type: SELECT_ROW_EPIC, payload: key })}>
            <TableCell style={{ width: "50%" }}>
              <Box color={isFuzzy ? "warning.main" : ""}>{key}</Box>
            </TableCell>
            <TableCell>
              <TextField
                color={isFuzzy ? "primary" : undefined}
                fullWidth
                // FIXME: 这里修改的话会取消待处理的标记,在过滤状态下,列表项会消失
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
                  onChange={(e) => {
                    setCurrent(0);
                    setKeyword(e.target.value);
                  }}
                />
              </TableCell>
              <TableCell>
                翻译文件
                <FormControlLabel
                  style={{ marginLeft: 15, fontSize: 12 }}
                  control={
                    <Switch
                      size="small"
                      checked={onlyTodo}
                      onChange={(e) => {
                        setCurrent(0);
                        setOnlyTodo(e.target.checked);
                      }}
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
        rowsPerPageOptions={[5, 10, 20, 30, 100, 500]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={current}
        onChangePage={(_e, index) => setCurrent(index)}
        onChangeRowsPerPage={(e) => setPageSize(parseInt(e.target.value))}
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
    .filter((key) => !!key)
    .filter((key) => {
      const {
        msgstr: [first] = [],
        comments: { flag = undefined } = {},
      } = list[key];
      return !onlyTodo || !first || flag === FUZZY;
    })
    .filter((f) => {
      const nextWord = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      return new RegExp(nextWord, "i").test(f);
    });
}
function onChange({ dispatch }: DispatchProp, key: string) {
  return ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: CHANGE_CONTENT_EPIC, payload: { key, value } });
  };
}

export const DataTable = connect<any, any, any, RootReducer>(
  (root: RootReducer) => root
)(DataTableInner);
