export class LocalStorageService {
  static clearState(key?: string): void {
    if (key) {
      return window.localStorage.removeItem(key);
    }

    window.localStorage.clear();
  }

  static setState<T = unknown>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  static getState<T = unknown>(key: string): T | null {
    const jsonState = window.localStorage.getItem(key);

    if (!jsonState) {
      return null;
    }

    return JSON.parse(jsonState);
  }
}
