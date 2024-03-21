import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainScreenRoutingModule } from './main-screen-routing.module';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { ChangeUnitsMeasurePipe } from '../../shared/pipes/change-units-measure.pipe';
import { CurrentWeatherComponent } from './main-screen/components/current-weather/current-weather.component';

@NgModule({
  declarations: [MainScreenComponent, CurrentWeatherComponent],
  imports: [
    CommonModule,
    MainScreenRoutingModule,
    ReactiveFormsModule,
    TimePipe,
    ChangeUnitsMeasurePipe,
  ],
})
export class MainScreenModule {}
