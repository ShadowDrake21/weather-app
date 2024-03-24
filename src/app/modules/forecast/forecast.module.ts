import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForecastRoutingModule } from './forecast-routing.module';
import { ForecastComponent } from './forecast/forecast.component';
import { ForecastItemComponent } from './forecast/components/forecast-item/forecast-item.component';
import { ChangeUnitsMeasurePipe } from '../../shared/pipes/change-units-measure.pipe';

@NgModule({
  declarations: [ForecastComponent, ForecastItemComponent],
  imports: [CommonModule, ForecastRoutingModule, ChangeUnitsMeasurePipe],
})
export class ForecastModule {}
