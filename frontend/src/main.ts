import 'zone.js'; // 👈 ¡ESTA ES LA LÍNEA MÁGICA! Debe ir de primera.

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
