import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { withInterceptors } from '@angular/common/http';
import { AuthTokenInterceptor } from './shared/interceptor/auth-token.interceptor'; // ajusta la ruta si es necesario
import { ApplicationConfig } from '@angular/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient( withInterceptors([AuthTokenInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),

    MessageService 
  ]
};
