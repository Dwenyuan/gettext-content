import { ActionBean } from "../bean/action.bean";
import { TranslationBean, Translation } from "../bean/content.bean";
import {
  SET_CONTENT,
  SELECT_ROW,
  UNREAD_FILE,
  CHANGE_CONTENT,
  MERGE_CONTENT
} from "./actions";
import { combineReducers } from "redux";
import { zipObjectDeep } from "lodash";
export interface RootReducer {
  ContentReducer: TranslationBean;
  SelectedTranslation: Translation;
}
export function ContentReducer(
  state: TranslationBean = { charset: "", headers: {}, translations: {} },
  action: ActionBean = { type: undefined }
): TranslationBean {
  const translationsInner = state.translations[""] || {};
  const { payload = {} } = action;
  switch (action.type) {
    case SET_CONTENT:
      return { ...state, ...action.payload };
    case UNREAD_FILE:
      return { charset: "", headers: {}, translations: {} };
    case MERGE_CONTENT:
      // 有可能出现json文件中有,而扫描结果中没有的情况,此时以扫描结果为准
      const keys = Object.keys(payload).filter(f => translationsInner[f]);
      const nextTranslations = zipObjectDeep(
        keys,
        keys.map(v => ({
          ...translationsInner[v],
          msgstr: [payload[v]]
        }))
      );
      return {
        ...state,
        translations: {
          ...state.translations,
          "": {
            ...translationsInner,
            ...nextTranslations
          }
        }
      };
    case CHANGE_CONTENT:
      const { key, value } = action.payload;
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
