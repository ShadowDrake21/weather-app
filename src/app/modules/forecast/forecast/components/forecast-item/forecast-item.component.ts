import { Observable, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

import { IForecastPoint } from '../../../../../shared/models/forecast.model';

@Component({
  selector: 'app-forecast-item',
  templateUrl: './forecast-item.component.html',
  styleUrl: './forecast-item.component.css',
})
export class ForecastItemComponent implements OnInit {
  @Input({ required: true, alias: 'item' }) forecastPoint!: IForecastPoint;

  forecastPoint$ = new Observable<IForecastPoint>();

  ngOnInit(): void {
    this.forecastPoint$ = of(this.forecastPoint);
  }
}
