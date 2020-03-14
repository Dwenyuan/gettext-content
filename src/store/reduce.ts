import { zipObjectDeep } from "lodash";
import { combineReducers } from "redux";
import { ActionBean } from "../bean/action.bean";
import { TranslationBean } from "../bean/content.bean";
import { FUZZY } from "../services/config";
import {
  CHANGE_CONTENT,
  MERGE_CONTENT,
  SELECT_ROW,
  SET_CONTENT,
  UNREAD_FILE
} from "./actions";
export interface RootReducer {
  ContentReducer: TranslationBean;
  SelectedTranslation: { selectedId?: string };
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
      const { key, value, fuzzy } = action.payload;
      const { comments } = translationsInner[key] || {};
      const result = {
        ...state,
        translations: {
          ...state.translations,
          "": {
            ...translationsInner,
            [key]: {
              ...translationsInner[key],
              msgstr: [value],
              comments: {
                ...comments,
                flag: fuzzy ? FUZZY : undefined
              }
            }
          }
        }
      };
      return result;
    default:
      return { ...state };
  }
}
export function SelectedTranslation(
  state: { selectedId?: string } = { selectedId: undefined },
  action: ActionBean<{ selectedId: string }>
) {
  switch (action.type) {
    case SELECT_ROW:
      return { selectedId: action.payload };
    default:
      return state;
  }
}
export const rootReducer = combineReducers({
  ContentReducer,
  SelectedTranslation
});
