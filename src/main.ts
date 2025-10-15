import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { appConfig } from './app/app.config';
import { tokenInterceptor } from './app/core/interceptors/token-interceptor';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideAnimations(),
    ...(appConfig.providers || []),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])), // ✅ Add HttpClient globally
  ],
}).catch((err) => console.error('❌ Bootstrap Error:', err));
