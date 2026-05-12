import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

interface AppConfig {
  apiKey?: string;
}

const loadLocalConfig = async (): Promise<void> => {
  try {
    const response = await fetch('assets/config/local-config.json', {
      cache: 'no-store',
    });

    if (!response.ok) {
      return;
    }

    (globalThis as { __APP_CONFIG__?: AppConfig }).__APP_CONFIG__ =
      await response.json() as AppConfig;
  } catch {
    // Local config is optional. The app falls back to environment values.
  }
};

loadLocalConfig().finally(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),
      provideHttpClient(),
    ],
  });
});
