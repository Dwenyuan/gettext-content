import { PoBean, Translation } from "gettext-lib";
import { isEmpty } from "lodash";
import { combineReducers } from "redux";
import { ActionBean } from "../bean/action.bean";
import { GlobalStatusBean } from "../bean/global_status.bean";
import { FUZZY } from "../services/config";
import { mergeTranslation } from "../utils/merge-translation";
import {
  CHANGE_CONTENT,
  CHANGE_SAVING_STATUS,
  CHANGE_TITLE,
  MERGE_CONTENT,
  SELECT_ROW,
  SET_CONTENT,
  UNREAD_FILE,
  MERGE_FROM_POT,
} from "./actions";
export interface RootReducer {
  GlobalStatus: GlobalStatusBean;
  TitleReducer: { title: string };
  ContentReducer: PoBean;
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
          flag: fuzzy ? FUZZY : undefined,
        },
      },
    };
  };
}
export function ContentReducer(
  state: PoBean = { charset: "", headers: {}, translations: {} },
  action: ActionBean = { type: undefined }
): PoBean {
  const translationsInner = state.translations[""] || {};
  const { payload = {} } = action;
  switch (action.type) {
    case SET_CONTENT:
      return { ...state, ...payload };
    case UNREAD_FILE:
      return { charset: "", headers: {}, translations: {} };
    case MERGE_CONTENT:
      return {
        ...state,
        translations: mergeTranslation(state.translations, payload),
      };
    case MERGE_FROM_POT:
      return {
        ...state,
        ...payload,
        translations: mergeTranslation(
          payload.translations,
          state.translations,
          true
        ),
      };
    case CHANGE_CONTENT:
      if (!Array.isArray(action.payload) && !isEmpty(action.payload)) {
        const nextTranslations = [action.payload].reduce(
          mergeTrans(translationsInner),
          translationsInner
        );
        // TODO: 需要替换合并方法
        return {
          ...state,
          translations: {
            ...state.translations,
            "": {
              ...nextTranslations,
            },
          },
        };
      }
      if (Array.isArray(action.payload) && !isEmpty(action.payload)) {
        // TODO: 需要替换合并方法
        const nextTranslations = action.payload.reduce(
          mergeTrans(translationsInner),
          translationsInner
        );
        return {
          ...state,
          translations: {
            ...state.translations,
            "": {
              ...nextTranslations,
            },
          },
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
  SelectedTranslation,
});
