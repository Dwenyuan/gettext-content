import { AnyAction } from "redux";
import { combineEpics, ofType, StateObservable } from "redux-observable";
import { Observable } from "rxjs/internal/Observable";
import { map, mergeMap, take, tap } from "rxjs/operators";
import { ActionBean } from "../bean/action.bean";
import { FETCH_CONTENT, SELECT_ROW, SELECT_ROW_EPIC } from "./actions";
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

export const rootEpic = combineEpics(fetchContent, selectRow);
