// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; // go up one level from app/
import { AuraCustomPreset } from './theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: AuraCustomPreset,
        options: {
          cssLayer: false, // must be true
          darkModeSelector: false,
          palette: {
            primary: 'blue', // this is the first (black) theme
            surface: 'slate', // optional, can be 'slate' or 'gray'
          },
        },
      },
    }),
    provideRouter(routes),
  ],
};
