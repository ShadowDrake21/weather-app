import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClocksRoutingModule } from './clocks-routing.module';
import { ClocksComponent } from './clocks/clocks.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ClocksComponent],
  imports: [CommonModule, ClocksRoutingModule, RouterModule],
})
export class ClocksModule {}
