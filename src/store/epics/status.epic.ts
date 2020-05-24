import { ofType } from "redux-observable";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { ActionBean } from "../../bean/action.bean";
import { CHANGE_SAVING_STATUS, CHANGE_SAVING_STATUS_EPIC } from "../actions";

/**
 * 修改保存状态
 * @param action$
 */
export const changeSavingStatus = (action$: Observable<ActionBean<null>>) =>
  action$.pipe(
    ofType(CHANGE_SAVING_STATUS_EPIC),
    map(({ payload }) => ({
      type: CHANGE_SAVING_STATUS,
      payload: { saving: payload },
    }))
  );
