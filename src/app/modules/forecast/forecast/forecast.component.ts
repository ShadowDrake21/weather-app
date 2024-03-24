import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ForecastService } from '../../../core/services/forecast.service';
import { WeatherService } from '../../../core/services/weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css',
})
export class ForecastComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private weatherService: WeatherService,
    private forecastService: ForecastService
  ) {}

  queryCityName$ = new Observable<string | null>();
  queryBgPath$ = new Observable<string | null>();

  ngOnInit(): void {
    this.queryCityName$ = this.activatedRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('city'))
    );
    this.queryCityName$.subscribe((cityName) => {
      console.log('cityName', cityName);
    });

    this.queryBgPath$ = this.activatedRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('bg'))
    );
    this.queryBgPath$.subscribe((path) => {
      console.log('path', path);
    });
  }
}
