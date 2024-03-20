import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainScreenRoutingModule } from './main-screen-routing.module';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from '../../shared/pipes/time.pipe';

@NgModule({
  declarations: [MainScreenComponent],
  imports: [
    CommonModule,
    MainScreenRoutingModule,
    ReactiveFormsModule,
    TimePipe,
  ],
})
export class MainScreenModule {}
