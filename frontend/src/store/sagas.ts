import axios from 'axios';
import { put, call, takeLeading } from 'redux-saga/effects';
import { ErrorCodes } from '../error';
import {
  actionTypes, FailureAppAction, FailureAppActionTypes,
} from './actions';

function* errorHandler(
  error: any,
  actionType: FailureAppActionTypes,
) {
  if (error.request && error.response) {
    yield put<FailureAppAction>({
      type: actionType,
      payload: {
        errors:
          error.response.data.message,
      },
    });
  } else if (
    error instanceof TypeError &&
    /network request failed/gi.test(error.message)
  ) {
    yield put<FailureAppAction>({
      type: actionType,
      payload: {
        errors: [ErrorCodes.SERVER_IS_UNAVAILABLE],
      },
    });
  } else {
    yield put<FailureAppAction>({
      type: actionType,
      payload: {
        errors: [ErrorCodes.INTERNAL_FRONTEND_ERROR],
      },
    });
  }
}

function* getMyself() {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.get('/api/users/me');
    });

    yield put({
      type: 'GET_MYSELF_SUCCESS',
      payload: {
        myself: response.data,
      },
    });
  } catch (error) {
    yield call(errorHandler, error, 'GET_MYSELF_FAILURE');
  }
}

export const rootSaga = function* rootSaga() {
  yield takeLeading(actionTypes.GET_MYSELF, getMyself);
};
