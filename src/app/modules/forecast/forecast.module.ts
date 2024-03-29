import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForecastRoutingModule } from './forecast-routing.module';
import { ForecastComponent } from './forecast/forecast.component';
import { ForecastItemComponent } from './forecast/components/forecast-item/forecast-item.component';
import { ChangeUnitsMeasurePipe } from '../../shared/pipes/change-units-measure.pipe';
import { ForecastSliderComponent } from './forecast/components/forecast-slider/forecast-slider.component';
import { ForecastAirPollutionComponent } from './forecast/components/forecast-air-pollution/forecast-air-pollution.component';
import { PaginationService } from '../../core/services/pagination.service';
import { ForecastAirPollutionItemComponent } from './forecast/components/forecast-air-pollution-item/forecast-air-pollution-item.component';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';

@NgModule({
  declarations: [
    ForecastComponent,
    ForecastItemComponent,
    ForecastSliderComponent,
    ForecastAirPollutionComponent,
    ForecastAirPollutionItemComponent,
  ],
  imports: [
    CommonModule,
    ForecastRoutingModule,
    ChangeUnitsMeasurePipe,
    TruncateTextPipe,
  ],
  providers: [PaginationService],
})
export class ForecastModule {}
