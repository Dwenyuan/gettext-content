import { isEmpty } from "lodash";
import { AnyAction } from "redux";
import { combineEpics, ofType, StateObservable } from "redux-observable";
import { interval, of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { map, mapTo, mergeMap, skip, switchMap, take, tap } from "rxjs/operators";
import { ActionBean } from "../bean/action.bean";
import { sourceLanguage } from "../bean/content.bean";
import { BaiduTransResultBean } from "../bean/trans_result.bean";
import { Lang, translatorByBaidu } from "../services/translator.service";
import { CHANGE_CONTENT, CHANGE_CONTENT_EPIC, FETCH_CONTENT, MERGE_CONTENT, MERGE_CONTENT_EPIC, PRE_TRANSLATOR, SELECT_ROW, SELECT_ROW_EPIC, UNREAD_FILE, UNREAD_FILE_EPIC } from "./actions";
import { RootReducer } from "./reduce";

/**
 * 从主线程中获取 po 文件内容
 * @param action$
 * @param state$
 */
export const fetchContent = (
  action$: Observable<AnyAction>,
  state$: StateObservable<void>
) => action$.pipe(ofType(FETCH_CONTENT));

export const mergeContent = (
  action$: Observable<ActionBean<{ [index: string]: string }>>,
  state$: Observable<RootReducer>
) =>
  action$.pipe(
    ofType(MERGE_CONTENT_EPIC),
    map(({ payload }) => ({ type: MERGE_CONTENT, payload }))
  );

export const selectRow = (
  action$: Observable<ActionBean<string>>,
  state$: Observable<RootReducer>
) =>
  action$.pipe(
    ofType(SELECT_ROW_EPIC),
    mergeMap(({ payload }: any) =>
      state$.pipe(
        take(1),
        map(
          ({ ContentReducer }) =>
            (ContentReducer.translations[""] || {})[payload]
        )
      )
    ),
    tap(console.log),
    map(payload => ({ type: SELECT_ROW, payload }))
  );
export const unreadFile = (
  action$: Observable<ActionBean<string>>,
  state$: Observable<RootReducer>
) =>
  action$.pipe(
    ofType(UNREAD_FILE_EPIC),
    tap(() => localStorage.removeItem("filePath")),
    mapTo({ type: UNREAD_FILE })
  );
export const changeContent = (
  action$: Observable<ActionBean<{ key: string; value: string }>>,
  state$: Observable<RootReducer>
) =>
  action$.pipe(
    ofType(CHANGE_CONTENT_EPIC),
    map(({ payload }) => ({ type: CHANGE_CONTENT, payload }))
  );
export const preTranslator = (
  action$: Observable<ActionBean<null>>,
  state$: Observable<RootReducer>
) =>
  action$.pipe(
    ofType(PRE_TRANSLATOR),
    switchMap(() =>
      state$.pipe(
        take(1),
        mergeMap(
          ({ ContentReducer }) => {
            const { Language = "" } = ContentReducer.headers;
            const translations = ContentReducer.translations[""] || {};
            const readyMsgIds = Object.keys(translations).filter(f => {
              if (!f) {
                return false;
              }
              const { msgstr = [] } = translations[f];
              const [first] = msgstr;
              return isEmpty(msgstr) || !first;
            });
            return interval(1200)
              .pipe(
                mergeMap(
                  index => of(...readyMsgIds).pipe(skip(index), take(1)),
                  (x, y) => y,
                  1
                ),
                tap(x => console.timeStamp("fanyi=> " + x))
              )
              .pipe(
                mergeMap(
                  query =>
                    translatorByBaidu({
                      query,
                      from: sourceLanguage,
                      to: Lang[Language]
                    }),
                  (msgId, res) => ({ msgId, res }),
                  1
                ),
                mergeMap(
                  ({ res }) => res.json<BaiduTransResultBean>(),
                  ({ msgId }, content) => ({ msgId, content }),
                  1
                ),
                map(({ msgId, content }) => {
                  // 全局翻译只取第一个结果
                  const { trans_result: [result = { dst: "" }] = [] } = content;
                  const { dst } = result;
                  return { key: msgId, value: dst };
                })
              );
          },
          // eslint-disable-next-line no-empty-pattern
          ({}, { key, value }) => ({ key, value })
        ),
        // retry(),
        map(payload => ({ type: CHANGE_CONTENT, payload }))
      )
    )
  );
export const rootEpic = combineEpics(
  fetchContent,
  selectRow,
  unreadFile,
  mergeContent,
  preTranslator,
  changeContent
);
