import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';

@Component({
  selector: 'app-current-air-pollution',
  templateUrl: './current-air-pollution.component.html',
  styleUrl: './current-air-pollution.component.css',
})
export class CurrentAirPollutionComponent {
  @Input({ required: true, alias: 'airPollutionData' }) airPollution$$ =
    new Subject<IAirPollutionList[] | null>();

  public getAirQualityText(value: number) {
    let text: string = '';

    switch (value) {
      case 1:
        text = 'Good';
        break;
      case 2:
        text = 'Fair';
        break;
      case 3:
        text = 'Moderate';
        break;
      case 4:
        text = 'Poor';
        break;
      case 5:
        text = 'Very Poor';
        break;
      default:
        text = 'Unknown';
        break;
    }

    return text;
  }
}
