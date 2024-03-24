import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { ForecastService } from '../../../core/services/forecast.service';
import { WeatherService } from '../../../core/services/weather.service';
import { GeocodingService } from '../../../core/services/geocoding.service';
import {
  ICityCoords,
  IGeocoding,
  ILocalNames,
} from '../../../shared/models/geocoding.model';
import { IForecast } from '../../../shared/models/forecast.model';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css',
})
export class ForecastComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private weatherService: WeatherService,
    private forecastService: ForecastService,
    private geocodingService: GeocodingService
  ) {}

  queryCityName$ = new Observable<string | null>();
  queryBgPath$ = new Observable<string | null>();
  cityCoords$ = new Observable<ICityCoords>();
  cityAlternativeNames$ = new Observable<ILocalNames | undefined>();
  cityForecast$ = new Observable<IForecast>();

  ngOnInit(): void {
    this.queryCityName$ = this.activatedRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('city'))
    );
    this.queryCityName$.subscribe((cityName) => {
      if (cityName) {
        this.getCityCoords(cityName);
        this.getCityForecast();
      }
    });

    this.queryBgPath$ = this.activatedRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('bg'))
    );
    this.queryBgPath$.subscribe((path) => {
      console.log('path', path);
    });
  }

  public getCityCoords(cityName: string) {
    this.geocodingService
      .getCoordinatesByLocationName(cityName, undefined, undefined, 1)
      .pipe(
        map((data) => {
          return data[0];
        }),
        switchMap((data) => {
          const cords: ICityCoords = { lat: data.lat, lon: data.lon };
          console.log(data);
          this.cityAlternativeNames$ = of(data.local_names);
          return of(cords);
        })
      )
      .subscribe({
        next: (cords) => {
          this.cityCoords$ = of(cords);
          this.getCityForecast();
        },
        error: (error) => {
          console.error('Error while getting city coordinates:', error);
        },
      });
  }

  public getCityForecast() {
    this.cityCoords$.subscribe((coordinates) => {
      this.cityForecast$ =
        this.forecastService.getFiveDaysForecastByCoordinates(
          coordinates.lat,
          coordinates.lon
        );
    });
    this.cityForecast$.subscribe((forecast) => {
      console.log(forecast);
    });
  }
}
