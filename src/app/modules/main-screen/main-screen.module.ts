import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainScreenRoutingModule } from './main-screen-routing.module';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { ChangeUnitsMeasurePipe } from '../../shared/pipes/change-units-measure.pipe';
import { CurrentWeatherComponent } from './main-screen/components/current-weather/current-weather.component';
import { CurrentAirPollutionComponent } from './main-screen/components/current-air-pollution/current-air-pollution.component';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';

@NgModule({
  declarations: [
    MainScreenComponent,
    CurrentWeatherComponent,
    CurrentAirPollutionComponent,
  ],
  imports: [
    CommonModule,
    MainScreenRoutingModule,
    ReactiveFormsModule,
    TimePipe,
    ChangeUnitsMeasurePipe,
    TruncateTextPipe,
  ],
})
export class MainScreenModule {}
