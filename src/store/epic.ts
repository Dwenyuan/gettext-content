import { isEmpty, isUndefined } from "lodash";
import { AnyAction } from "redux";
import { combineEpics, ofType } from "redux-observable";
import { interval, of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import {
  catchError,
  map,
  mapTo,
  mergeMap,
  skip,
  switchMap,
  take,
} from "rxjs/operators";
import { ActionBean } from "../bean/action.bean";
import { sourceLanguage, TranslationBean } from "../bean/content.bean";
import { BaiduTransResultBean } from "../bean/trans_result.bean";
import { Lang, translatorByBaidu } from "../services/translator.service";
import {
  CHANGE_TITLE,
  CHANGE_TITLE_EPIC,
  CHANGE_CONTENT,
  CHANGE_CONTENT_EPIC,
  FETCH_CONTENT,
  MERGE_CONTENT,
  MERGE_CONTENT_EPIC,
  PRE_TRANSLATOR,
  SELECT_ROW,
  SELECT_ROW_EPIC,
  UNREAD_FILE,
  UNREAD_FILE_EPIC,
} from "./actions";
import { RootReducer } from "./reduce";

/**
 * 从主线程中获取 po 文件内容
 * @param action$
 * @param state$
 */
export const fetchContent = (action$: Observable<AnyAction>) =>
  action$.pipe(ofType(FETCH_CONTENT));

export const mergeContent = (
  action$: Observable<ActionBean<{ [index: string]: string }>>
) =>
  action$.pipe(
    ofType(MERGE_CONTENT_EPIC),
    map(({ payload }) => ({ type: MERGE_CONTENT, payload }))
  );

export const selectRow = (action$: Observable<ActionBean<string>>) =>
  action$.pipe(
    ofType(SELECT_ROW_EPIC),
    map(({ payload }) => ({ type: SELECT_ROW, payload }))
  );
export const unreadFile = (action$: Observable<ActionBean<string>>) =>
  action$.pipe(ofType(UNREAD_FILE_EPIC), mapTo({ type: UNREAD_FILE }));
export const changeContent = (
  action$: Observable<ActionBean<{ key: string; value: string }>>
) =>
  action$.pipe(
    ofType(CHANGE_CONTENT_EPIC),
    map(({ payload }) => ({ type: CHANGE_CONTENT, payload }))
  );

/**
 * 从翻译结构中提取要翻译的文本
 *
 * @param {{
 *   ContentReducer: TranslationBean;
 * }} {
 *   ContentReducer
 * }
 * @returns
 */
export function exactQueryStr({
  ContentReducer,
}: {
  ContentReducer: TranslationBean;
}) {
  const translations = ContentReducer.translations[""] || {};
  return Object.keys(translations).filter((f) => {
    if (!f) {
      return false;
    }
    const { msgstr = [] } = translations[f];
    const [first] = msgstr;
    return isEmpty(msgstr) || !first;
  });
}
/**
 * 将要查询的文本数组用 \n 拼接起来
 * 如果过长的话就分组
 * @export
 * @param {string[]} readyMsgIds
 * @returns
 */
export function spliceStr(readyMsgIds: string[]) {
  return readyMsgIds.reduce((pre, next) => {
    const current = pre[pre.length - 1];
    // 单次翻译的长度还是不超过1500吧，encode之后可能会过长
    if (isUndefined(current) || current.length + next.length > 1e3) {
      return pre.concat([next]);
    } else {
      pre[pre.length - 1] = current + " \n " + next;
      return pre;
    }
  }, [] as string[]);
}
export const preTranslator = (
  action$: Observable<ActionBean<null>>,
  state$: Observable<RootReducer>
) =>
  action$.pipe(
    ofType(PRE_TRANSLATOR),
    switchMap(() =>
      state$.pipe(
        take(1),
        mergeMap(({ ContentReducer }) => {
          const { Language = "" } = ContentReducer.headers;
          const transSource = exactQueryStr({ ContentReducer });
          if (sourceLanguage === Lang[Language]) {
            return of(transSource.map((key) => ({ key, value: key })));
          }
          const querys = spliceStr(transSource);
          return interval(3e3)
            .pipe(
              mergeMap(
                (index) => of(...querys).pipe(skip(index), take(1)),
                (x, y) => y,
                1
              )
            )
            .pipe(
              mergeMap(
                (query) =>
                  translatorByBaidu({
                    query,
                    from: sourceLanguage,
                    to: Lang[Language],
                  }),
                (_d, res) => ({ res }),
                1
              ),
              mergeMap(
                ({ res }) => res.json<BaiduTransResultBean>(),
                (_d, content) => ({ content }),
                1
              ),
              map(({ content }) => {
                const { trans_result = [] } = content;
                return trans_result.map(({ src, dst }) => ({
                  key: src,
                  value: dst,
                  fuzzy: true,
                }));
              })
            );
        }),
        catchError(() => of([])),
        map((payload) => ({ type: CHANGE_CONTENT, payload }))
      )
    )
  );

export const changeTitle = (
  action$: Observable<ActionBean<null>>) =>
  action$.pipe(
    ofType(CHANGE_TITLE_EPIC),
    map(({ payload }) => ({ type: CHANGE_TITLE, payload }))
  );
export const rootEpic = combineEpics(
  changeTitle,
  fetchContent,
  selectRow,
  unreadFile,
  mergeContent,
  preTranslator,
  changeContent
);
