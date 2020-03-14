import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { Translation, TranslationBean } from "../bean/content.bean";
import { CHANGE_CONTENT_EPIC, SELECT_ROW_EPIC } from "../store/actions";
import { mapTanslation } from "../store/mapStateToProps";
const useStyle = makeStyles({
  container: {
    height: "calc(100vh - 28px)"
  }
});
interface IProps extends TranslationBean, DispatchProp {}
export function DataTableInner(props: IProps) {
  const classes = useStyle();
  const { translations, dispatch } = props;
  console.log(translations);
  // const list = translations[""];
  const [list, setList] = useState<{ [index: string]: Translation }>({});
  const keys = Object.keys(list || {});
  useEffect(() => {
    setList(translations[""]);
  }, [setList, translations]);
  const tableBody = keys
    .filter(key => !!key)
    .map(key => (
      <TableRow
        key={key}
        onClick={() => dispatch({ type: SELECT_ROW_EPIC, payload: key })}
      >
        <TableCell>{key}</TableCell>
        <TableCell>
          <TextField
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
function onChange({ dispatch }: DispatchProp, key: string) {
  return ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: CHANGE_CONTENT_EPIC, payload: { key, value } });
  };
}

export const DataTable = connect<
  any,
  any,
  any,
  { ContentReducer: TranslationBean }
>(mapTanslation)(DataTableInner);
