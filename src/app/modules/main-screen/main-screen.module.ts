import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainScreenRoutingModule } from './main-screen-routing.module';
import { MainScreenComponent } from './main-screen/main-screen.component';


@NgModule({
  declarations: [
    MainScreenComponent
  ],
  imports: [
    CommonModule,
    MainScreenRoutingModule
  ]
})
export class MainScreenModule { }
