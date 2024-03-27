import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MAIN_WEATHER_ENDPOINT,
  MAIN_WEATHER_PATH_PART,
} from '../constants/weather.constans';
import { environment } from '../../../environments/environment.development';
import { IAirPollution } from '../../shared/models/airpollution.model';
import { MAIN_CORS_ENDPOINT } from '../constants/cors.constants';

@Injectable({
  providedIn: 'root',
})
export class AirPollutionService {
  constructor(private http: HttpClient) {}

  public getCurrentAirPollutionData(
    lat: number,
    lon: number
  ): Observable<IAirPollution> {
    return this.http.get<IAirPollution>(
      `${MAIN_CORS_ENDPOINT}${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}air_pollution?lat=${lat}&lon=${lon}&appid=${environment.weatherApiKey}`
    );
  }

  public getForecastAirPollutionData(
    lat: number,
    lon: number
  ): Observable<IAirPollution> {
    return this.http.get<IAirPollution>(
      `${MAIN_CORS_ENDPOINT}${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${environment.weatherApiKey}`
    );
  }

  public getHistoricalAirPollutionData(
    lat: number,
    lon: number,
    start: string,
    end: string
  ): Observable<IAirPollution> {
    return this.http.get<IAirPollution>(
      `${MAIN_CORS_ENDPOINT}${MAIN_WEATHER_ENDPOINT}${MAIN_WEATHER_PATH_PART}air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${environment.weatherApiKey}`
    );
  }
}
