import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClocksComponent } from './clocks/clocks.component';

const routes: Routes = [{ path: '', component: ClocksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClocksRoutingModule {}
