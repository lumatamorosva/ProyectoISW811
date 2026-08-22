import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from '../core/interceptors/http-error.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthService } from '../core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNativeDateAdapter(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient( withInterceptors([authInterceptor, httpErrorInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.inicializarSesion();
    })
  ]
};
