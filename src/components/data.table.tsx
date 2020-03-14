import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { connect, DispatchProp } from "react-redux";
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
    SelectedTranslation: { msgid: selectedId },
    dispatch
  } = props;
  const classes = useStyle();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const list = translations[""];
  const keys = Object.keys(list || {});
  useEffect(() => {
    setTotal(keys.filter(key => !!key).length);
  }, [keys]);
  const fillCount = keys
    .filter(key => !!key)
    .filter(f => {
      const { msgstr: [first] = [] } = list[f] || {};
      return !!first;
    }).length;
  const tableBody = keys
    .filter(key => !!key)
    .slice(current * pageSize, current * pageSize + pageSize)
    .map(key => (
      <TableRow
        selected={selectedId === key}
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
            rowsMax="1"
            value={list[key].msgstr}
          />
        </TableCell>
      </TableRow>
    ));
  return (
    <React.Fragment>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                源文件 ({fillCount}/{total})
              </TableCell>
              <TableCell>翻译文件</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableBody}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
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
