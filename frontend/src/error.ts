/**
 * Custom error class
 * @description Should be called when an error happens on backend.
 * Should contain a list of errors (manifested in error codes) that went
 * wrong. Mostly one error code will be enough, but just in case, you can
 * return multiple error coeds, signifying that multiple things have gone wrong
 */
export class Errors extends Error {
  errorCodes;

  constructor(errorCodes: ErrorCodes[]) {
    super();

    this.errorCodes = errorCodes;
  }
}

/**
 * Error codes
 */
export enum ErrorCodes {
  ADMIN_INCORRECT_EMAIL = 'ADMIN_INCORRECT_EMAIL',
  ADMIN_INCORRECT_PASSWORD = 'ADMIN_INCORRECT_PASSWORD',

  ENDUSER_INCORRECT_EMAIL = 'ENDUSER_INCORRECT_EMAIL',
  ENDUSER_INCORRECT_PASSWORD = 'ENDUSER_INCORRECT_PASSWORD',

  NOT_AUTHORIZED_ADMIN = 'NOT_AUTHORIZED_ADMIN',
  NOT_AUTHORIZED_ENDUSER = 'NOT_AUTHORIZED_ENDUSER',
  ENDUSER_EMAIL_TAKEN = 'ENDUSER_EMAIL_TAKEN',
  PROVIDER_EMAIL_TAKEN = 'PROVIDER_EMAIL_TAKEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',

  /**
   * Front-end specific errors
   */
  INTERNAL_FRONTEND_ERROR = 'INTERNAL_FRONTEND_ERROR',
  SERVER_IS_UNAVAILABLE = 'SERVER_IS_UNAVAILABLE',
}

/**
 *
 */
export const errorCodesToMessage = (errorCodes: ErrorCodes[]) => {
  let str = '';
  let i = 0;
  const l = Object.values(errorCodes).length;

  Object.values(errorCodes).forEach((errorCode) => {
    let errorMessage = '';

    switch (errorCode) {
      case ErrorCodes.ADMIN_INCORRECT_EMAIL: errorMessage = 'There is no admin with this email'; break;
      case ErrorCodes.ADMIN_INCORRECT_PASSWORD: errorMessage = 'Incorrect password'; break;

      case ErrorCodes.ENDUSER_INCORRECT_EMAIL: errorMessage = 'There is no user with this email'; break;
      case ErrorCodes.ENDUSER_INCORRECT_PASSWORD: errorMessage = 'Incorrect password'; break;

      case ErrorCodes.NOT_AUTHORIZED_ADMIN: errorMessage = 'You are not authorized as admin'; break;
      case ErrorCodes.NOT_AUTHORIZED_ENDUSER: errorMessage = 'You are not authorized as user'; break;
      case ErrorCodes.ENDUSER_EMAIL_TAKEN: errorMessage = 'This email is already taken by a different user'; break;
      case ErrorCodes.PROVIDER_EMAIL_TAKEN: errorMessage = 'This email is already taken by a different service provider'; break;
      case ErrorCodes.INTERNAL_SERVER_ERROR: errorMessage = 'Unexpected error has happened on the backend'; break;

      case ErrorCodes.SERVICE_NOT_FOUND: errorMessage = 'Service not found'; break;

      /**
       * Front-end specific errors
       */
      case ErrorCodes.INTERNAL_FRONTEND_ERROR: errorMessage = 'Unexpected error has happened on the frontend'; break;
      case ErrorCodes.SERVER_IS_UNAVAILABLE: errorMessage = 'Server is unavailable'; break;

      default: errorMessage = 'Unexpected error'; break;
    }

    str += errorMessage;

    if (l > 1) {
      let lastSign = '';

      if (i === l - 1) lastSign = '.';
      else lastSign = ',';

      str += lastSign;
    }

    i++;
  });

  return str;
};

