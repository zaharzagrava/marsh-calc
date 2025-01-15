import {produce} from 'immer';
import { ErrorCodes } from '../error';
import { actionTypes, AppAction } from './actions';
import { Myself } from './types';

/* Initial State */
export const RootReducerInitialState = {
  forms: {
    provider: {
      providerIndex: null as string | null,
    },
  },

  ui: {
    monitoringAndPlanning: {
      from: 202201 as number | null,
      to: 202301 as number | null,
    }
  },

  actions: {
    getMyself: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is user logged in
    },
  },

  /**
   * Is modified by the following actions
   *  - getMyself
   */
  myself: null as Myself | null,
};

export type AppState = typeof RootReducerInitialState;

/* Reducer */
export const RootReducer = produce(
  (draft: AppState, action: AppAction) => {
    switch (action.type) {
      case actionTypes.GET_MYSELF:
        draft.actions.getMyself.errors = null;
        draft.actions.getMyself.loading = true;
        break;
      case actionTypes.GET_MYSELF_SUCCESS:
        draft.myself = action.payload.myself;
        draft.actions.getMyself.errors = null;
        draft.actions.getMyself.loading = false;
        draft.actions.getMyself.success = true;
        break;
      case actionTypes.GET_MYSELF_FAILURE:
        draft.actions.getMyself.errors = action.payload.errors;
        draft.actions.getMyself.loading = false;
        draft.actions.getMyself.success = false;
        break;

      /* UI actions */

      default:
        break;
    }
  },
  RootReducerInitialState,
);
