import { ErrorCodes } from "../error";
import { Myself } from "./types";

/* Action Types */
export const actionTypes = {
  LOGGED_IN: "LOGGED_IN" as const,

  //

  GET_MYSELF: "GET_MYSELF" as const,
  GET_MYSELF_SUCCESS: "GET_MYSELF_SUCCESS" as const,
  GET_MYSELF_FAILURE: "GET_MYSELF_FAILURE" as const,

  LOG_OUT_ENDUSER: "LOG_OUT_ENDUSER" as const,
  LOG_OUT_ENDUSER_SUCCESS:
    "LOG_OUT_ENDUSER_SUCCESS" as const,
  LOG_OUT_ENDUSER_FAILURE:
    "LOG_OUT_ENDUSER_FAILURE" as const,
};

/* Actions */
export interface LoggedIn {
  type: typeof actionTypes.LOGGED_IN;
}

//

export interface GetMyself {
  type: typeof actionTypes.GET_MYSELF;
}

export interface GetMyselfSuccess {
  type: typeof actionTypes.GET_MYSELF_SUCCESS;
  payload: {
    myself: Myself;
  };
}

export interface GetMyselfFailure {
  type: typeof actionTypes.GET_MYSELF_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface LogOutEnduser {
  type: typeof actionTypes.LOG_OUT_ENDUSER;
}

export interface LogOutEnduserSuccess {
  type: typeof actionTypes.LOG_OUT_ENDUSER_SUCCESS;
}

export interface LogOutEnduserFailure {
  type: typeof actionTypes.LOG_OUT_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

/** UI actions */

export type FailureAppActionTypes =
  | typeof actionTypes.GET_MYSELF_FAILURE
  ;



export type FailureAppAction =
  | GetMyselfFailure
  | LogOutEnduserFailure;

export type AppAction =
  | LoggedIn
  | GetMyself
  | GetMyselfSuccess
  | GetMyselfFailure
  | LogOutEnduser
  | LogOutEnduserSuccess
  | LogOutEnduserFailure;
