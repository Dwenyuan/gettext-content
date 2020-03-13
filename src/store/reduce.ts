import { ActionBean } from "../bean/action.bean";
import { ContentBean, Translation } from "../bean/content.bean";
import { SET_CONTENT, SELECT_ROW } from "./actions";
import { combineReducers } from "redux";
export interface RootReducer {
  ContentReducer: ContentBean;
  SelectedTranslation: Translation;
}
export function ContentReducer(
  state: ContentBean = { charset: "", header: {}, translations: {} },
  action: ActionBean = { type: undefined }
) {
  switch (action.type) {
    case SET_CONTENT:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
}
export function SelectedTranslation(
  state: Translation = {},
  action: ActionBean
) {
  switch (action.type) {
    case SELECT_ROW:
      return action.payload;
    default:
      return state;
  }
}
export const rootReducer = combineReducers({
  ContentReducer,
  SelectedTranslation
});
