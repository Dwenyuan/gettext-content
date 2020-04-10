import { zipObjectDeep, isEmpty } from "lodash";
import { combineReducers } from "redux";
import { ActionBean } from "../bean/action.bean";
import { Translation, TranslationBean } from "../bean/content.bean";
import { FUZZY } from "../services/config";
import {
  CHANGE_CONTENT,
  MERGE_CONTENT,
  SELECT_ROW,
  SET_CONTENT,
  UNREAD_FILE,
  CHANGE_TITLE,
  CHANGE_SAVING_STATUS
} from "./actions";
import { GlobalStatusBean } from "../bean/global_status.bean";
export interface RootReducer {
  GlobalStatus: GlobalStatusBean;
  TitleReducer: { title: string };
  ContentReducer: TranslationBean;
  SelectedTranslation?: { selectedId?: string };
}
type TransObject = { [index: string]: Translation };
function mergeTrans(translationsInner: TransObject) {
  return (
    pre: TransObject,
    next: { key: string; value: string; fuzzy: number }
  ) => {
    const { key, value, fuzzy } = next;
    const { comments, ...rest } = translationsInner[key] || {};
    return {
      ...pre,
      [key]: {
        ...rest,
        msgstr: [value],
        comments: {
          ...comments,
          flag: fuzzy ? FUZZY : undefined
        }
      }
    };
  };
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
          comments: {
            // 导入的情况下取消掉待处理的标示
            ...(translationsInner[v].comments || {}),
            flag: undefined
          },
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
      if (!Array.isArray(action.payload) && !isEmpty(action.payload)) {
        const nextTranslations = [action.payload].reduce(
          mergeTrans(translationsInner),
          translationsInner
        );
        return {
          ...state,
          translations: {
            ...state.translations,
            "": {
              ...nextTranslations
            }
          }
        };
      }
      if (Array.isArray(action.payload) && !isEmpty(action.payload)) {
        const nextTranslations = action.payload.reduce(
          mergeTrans(translationsInner),
          translationsInner
        );
        return {
          ...state,
          translations: {
            ...state.translations,
            "": {
              ...nextTranslations
            }
          }
        };
      }
      return state;
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
export function TitleReducer(
  state: { title: string } = { title: "PO-EDIT" },
  action: ActionBean<string>
) {
  switch (action.type) {
    case CHANGE_TITLE:
      if (action.payload) {
        localStorage.setItem("filePath", action.payload);
      } else {
        localStorage.removeItem("filePath");
      }
      return { title: "PO-EDIT   " + action.payload || "" };
    default:
      return state;
  }
}

export function GlobalStatus(
  state: GlobalStatusBean = { saving: false },
  action: ActionBean<GlobalStatusBean>
): GlobalStatusBean {
  switch (action.type) {
    case CHANGE_SAVING_STATUS:
      const { saving = false } = action.payload! || {};
      return { ...state, saving };
    default:
      return state;
  }
}
export const rootReducer = combineReducers({
  GlobalStatus,
  TitleReducer,
  ContentReducer,
  SelectedTranslation
});
