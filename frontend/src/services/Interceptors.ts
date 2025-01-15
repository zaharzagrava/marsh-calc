import Axios from 'axios'
import { Config, getApiHostname } from '../config';
import { LocalStorageService } from './local-storage-service';

export class InterceptorService {
  public static init(appConfig: Config): void {
    Axios.defaults.baseURL = `${getApiHostname()}${appConfig.apiBaseUrl}`;

    InterceptorService.addRequestInterceptor();
  }

  private static requestInterceptorId = -1;

  private static addRequestInterceptor(): void {
    if (InterceptorService.requestInterceptorId === -1) {
      InterceptorService.requestInterceptorId = Axios.interceptors.request.use(
        async (axiosConfig) => {
          const token = await LocalStorageService.getState('x-user-token');
          axiosConfig.headers['x-user-token'] = token;
          return axiosConfig;
        },
      );
    }
  }
}
