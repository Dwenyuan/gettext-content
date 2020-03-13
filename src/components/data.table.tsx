import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { TranslationBean } from "../bean/content.bean";
import { SELECT_ROW_EPIC } from "../store/actions";
import { mapTanslation } from "../store/mapStateToProps";
const useStyle = makeStyles({
  container: {
    height: "calc(100vh - 260px - 21px - 40px)"
  }
});
interface IProps extends TranslationBean, DispatchProp {}
export function DataTableInner(props: IProps) {
  const classes = useStyle();
  const { translations, dispatch } = props;
  console.log(translations);
  const list = translations[""];
  const keys = Object.keys(list || {});
  const tableBody = keys
    .filter(key => !!key)
    .map(key => (
      <TableRow
        key={key}
        onClick={() => dispatch({ type: SELECT_ROW_EPIC, payload: key })}
      >
        <TableCell>{key}</TableCell>
        <TableCell>{list[key].msgstr}</TableCell>
      </TableRow>
    ));
  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>源文件</TableCell>
            <TableCell>翻译文件</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableBody}</TableBody>
      </Table>
    </TableContainer>
  );
}
export const DataTable = connect<
  any,
  any,
  any,
  { ContentReducer: TranslationBean }
>(mapTanslation)(DataTableInner);
