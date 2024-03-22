import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  MAIN_WEATHER_ENDPOINT,
  MAIN_WEATHER_PATH_PART,
} from '../constants/weather.constans';
import { IWeatherByNow } from '../../shared/models/weather.model';
import { Units } from '../../shared/models/generals.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  public getCurrentWeatherByCoordinates(
    lat: number,
    lon: number,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IWeatherByNow> {
    return this.http.get<IWeatherByNow>(
      `${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}weather?lat=${lat}&lon=${lon}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  // imperial - Fahrenheit, metric - Celsius, Kelvin - standart
  public getCurrentWeatherByName(
    cityName: string,
    stateCode?: string,
    countryCode?: string,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IWeatherByNow> {
    return this.http.get<IWeatherByNow>(
      `https://corsproxy.io/?${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}weather?q=${cityName}` +
        (stateCode ? `,${stateCode}` : '') +
        (countryCode ? `,${countryCode}` : '') +
        `&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  public getCurrentWeatherByCityID(
    cityId: string,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IWeatherByNow> {
    return this.http.get<IWeatherByNow>(
      `https://corsproxy.io/?${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}weather?id=${Number.parseInt(
        cityId
      )}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  public getCurrentWeatherByZipcode(
    zipcode: string,
    countryCode: string,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IWeatherByNow> {
    return this.http.get<IWeatherByNow>(
      `https://corsproxy.io/?${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}weather?zip=${zipcode},${countryCode}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }
}
