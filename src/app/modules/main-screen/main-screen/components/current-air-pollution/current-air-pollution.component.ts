import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';
import { getAirQualityText } from '../../../../../shared/utils/generals.utils';

@Component({
  selector: 'app-current-air-pollution',
  templateUrl: './current-air-pollution.component.html',
  styleUrl: './current-air-pollution.component.css',
})
export class CurrentAirPollutionComponent {
  @Input({ required: true, alias: 'airPollutionData' }) airPollution$$ =
    new Subject<IAirPollutionList[] | null>();

  public getAirQualityText = getAirQualityText;
}
