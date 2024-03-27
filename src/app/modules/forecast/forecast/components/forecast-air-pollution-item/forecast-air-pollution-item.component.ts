import { Observable, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';
import { convertUnixTimestampToUTC } from '../../../../../shared/utils/dateAndTime.utils';
import { getAirQualityText } from '../../../../../shared/utils/generals.utils';

@Component({
  selector: 'app-forecast-air-pollution-item',
  templateUrl: './forecast-air-pollution-item.component.html',
  styleUrl: './forecast-air-pollution-item.component.css',
})
export class ForecastAirPollutionItemComponent implements OnInit {
  @Input({ required: true, alias: 'item' }) pollutionItem!: IAirPollutionList;

  public pollutionItem$ = new Observable<IAirPollutionList>();

  ngOnInit(): void {
    this.pollutionItem$ = of(this.pollutionItem);
  }

  public convertUnixTimestampToUTC = convertUnixTimestampToUTC;
  public getAirQualityText = getAirQualityText;
}
