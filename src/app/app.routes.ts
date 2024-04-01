import { Routes } from '@angular/router';
import { accessGuard } from './core/guards/access.guard';
import { MainScreenModule } from './modules/main-screen/main-screen.module';

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
    canActivate: [accessGuard],
  },
  {
    path: 'clocks',
    loadChildren: () =>
      import('./modules/clocks/clocks.module').then((m) => m.ClocksModule),
  },
  { path: '**', redirectTo: '/main' },
];
