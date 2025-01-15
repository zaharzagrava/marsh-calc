
export const LOCALHOST = 'localhost';
export const DEV_HOST_IDENTIFIER = '';

export const is = {
  localhost: window.location.hostname.includes(LOCALHOST),
  dev: window.location.hostname.includes(DEV_HOST_IDENTIFIER),
};
