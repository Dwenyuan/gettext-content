import { ActionBean } from "../bean/action.bean";
import { TranslationBean, Translation } from "../bean/content.bean";
import {
  SET_CONTENT,
  SELECT_ROW,
  UNREAD_FILE,
  CHANGE_CONTENT
} from "./actions";
import { combineReducers } from "redux";
export interface RootReducer {
  ContentReducer: TranslationBean;
  SelectedTranslation: Translation;
}
export function ContentReducer(
  state: TranslationBean = { charset: "", headers: {}, translations: {} },
  action: ActionBean = { type: undefined }
) {
  switch (action.type) {
    case SET_CONTENT:
      return { ...state, ...action.payload };
    case UNREAD_FILE:
      return { charset: "", headers: {}, translations: {} };
    case CHANGE_CONTENT:
      const { key, value } = action.payload;
      const translationsInner = state.translations[""] || {};
      const result = {
        ...state,
        translations: {
          ...state.translations,
          "": {
            ...translationsInner,
            [key]: { ...translationsInner[key], msgstr: [value] }
          }
        }
      };
      return result;
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
