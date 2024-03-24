import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  MAIN_WEATHER_ENDPOINT,
  MAIN_WEATHER_PATH_PART,
} from '../constants/weather.constans';
import { environment } from '../../../environments/environment.development';
import { IForecast } from '../../shared/models/forecast.model';
import { Units } from '../../shared/models/generals.model';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  constructor(private http: HttpClient) {}

  public getiveDaysForecastByCoordinates(
    lat: number,
    lon: number,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IForecast> {
    return this.http.get<IForecast>(
      `${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  public getFiveDaysForecastByName(
    cityName: string,
    stateCode?: string,
    countryCode?: string,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IForecast> {
    return this.http.get<IForecast>(
      `${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}forecast?q=${cityName}` +
        (stateCode ? `,${stateCode}` : '') +
        (countryCode ? `,${countryCode}` : '') +
        `&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  public getFiveDaysForecastByCityID(
    cityId: number,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IForecast> {
    return this.http.get<IForecast>(
      `${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}forecast?id=${cityId}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  public getFiveDaysForecastByZipcode(
    zipcode: string,
    countryCode: string,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IForecast> {
    return this.http.get<IForecast>(
      `${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}forecast?zip=${zipcode},${countryCode}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }
}
