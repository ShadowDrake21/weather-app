import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { IWeatherByNow } from '../../../../../shared/models/weather.model';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css',
})
export class CurrentWeatherComponent {
  @Input({ required: true, alias: 'weatherData' }) weather$$ =
    new Subject<IWeatherByNow>();
}
