import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClocksRoutingModule } from './clocks-routing.module';
import { ClocksComponent } from './clocks/clocks.component';


@NgModule({
  declarations: [
    ClocksComponent
  ],
  imports: [
    CommonModule,
    ClocksRoutingModule
  ]
})
export class ClocksModule { }
