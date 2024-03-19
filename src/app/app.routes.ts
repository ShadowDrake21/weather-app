import { Routes } from '@angular/router';
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
];
