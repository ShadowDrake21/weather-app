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
import { HistoricalAirPollutionComponent } from './forecast/components/historical-ari-pollution/historical-air-pollution.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AirPollutionListComponent } from './forecast/components/air-pollution-list/air-pollution-list.component';

@NgModule({
  declarations: [
    ForecastComponent,
    ForecastItemComponent,
    ForecastSliderComponent,
    ForecastAirPollutionComponent,
    ForecastAirPollutionItemComponent,
    HistoricalAirPollutionComponent,
    AirPollutionListComponent,
  ],
  imports: [
    CommonModule,
    ForecastRoutingModule,
    ChangeUnitsMeasurePipe,
    TruncateTextPipe,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class ForecastModule {}
