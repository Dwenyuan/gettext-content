import { AnyAction } from "redux";

export interface ActionBean<T = any> extends AnyAction {
  payload?: T;
}
