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
import { MAIN_CORS_ENDPOINT } from '../constants/cors.constants';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private proxyWeatherUrl = `${MAIN_CORS_ENDPOINT}/api/weather`;

  constructor(private http: HttpClient) {}

  public getCurrentWeatherByCoordinates(
    lat: number,
    lon: number,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IWeatherByNow> {
    return this.http.get<IWeatherByNow>(
      `${this.proxyWeatherUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
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
      `${this.proxyWeatherUrl}?q=${cityName}` +
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
      `${this.proxyWeatherUrl}?id=${cityId}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }

  public getCurrentWeatherByZipcode(
    zipcode: string,
    countryCode: string,
    units: Units = 'metric',
    lang: string = 'en'
  ): Observable<IWeatherByNow> {
    return this.http.get<IWeatherByNow>(
      `${this.proxyWeatherUrl}?zip=${zipcode},${countryCode}&units=${units}&appid=${environment.weatherApiKey}&lang=${lang}`
    );
  }
}
