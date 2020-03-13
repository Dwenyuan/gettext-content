import { Grid, TextField } from "@material-ui/core";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { RootReducer } from "../store/reduce";
import { Translation } from "../bean/content.bean";

interface IProps extends DispatchProp, Translation {}

export const TranslatorArea = connect<
  Translation,
  DispatchProp,
  Translation,
  RootReducer
>(({ SelectedTranslation }) => SelectedTranslation)((props: IProps) => {
  const { msgid, msgstr } = props;
  return (
    <Grid container direction="column">
      <TextField
        label="源文件"
        multiline
        rows="4"
        value={msgid}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />
      <br />
      <TextField
        label="翻译"
        multiline
        rows="4"
        value={msgstr}
        // defaultValue="Default Value"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />
    </Grid>
  );
});
