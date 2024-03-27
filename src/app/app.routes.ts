import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  {
    path: 'main',
    loadChildren: () =>
      import('./modules/main-screen/main-screen.module').then(
        (m) => m.MainScreenModule
      ),
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./modules/forecast/forecast.module').then(
        (m) => m.ForecastModule
      ),
  },
  {
    path: 'clocks',
    loadChildren: () =>
      import('./modules/clocks/clocks.module').then((m) => m.ClocksModule),
  },
];
