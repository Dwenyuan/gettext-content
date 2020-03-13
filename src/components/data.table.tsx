import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { ContentBean } from "../bean/content.bean";
import { SELECT_ROW_EPIC } from "../store/actions";
const useStyle = makeStyles({
  container: {
    height: "calc(100vh - 260px - 21px - 40px)"
  }
});
interface IProps extends ContentBean, DispatchProp {}
export function DataTableInner(props: IProps) {
  const classes = useStyle();
  const { charset, header, translations, dispatch } = props;
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
function mapStateToProps({ ContentReducer }: { ContentReducer: ContentBean }) {
  return { ...ContentReducer };
}
export const DataTable = connect<
  any,
  any,
  any,
  { ContentReducer: ContentBean }
>(mapStateToProps)(DataTableInner);
