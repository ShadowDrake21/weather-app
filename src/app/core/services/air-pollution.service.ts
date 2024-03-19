import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MAIN_ENDPOINT, MAIN_PATH_PART } from '../constants/main.constans';
import { environment } from '../../../environments/environment';
import { IAirPollution } from '../../shared/models/airpollution.model';

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
      `${MAIN_ENDPOINT}${MAIN_PATH_PART}air_pollution?lat=${lat}&lon=${lon}&appid=${environment.weatherApiKey}`
    );
  }

  public getForecastAirPollutionData(
    lat: number,
    lon: number
  ): Observable<IAirPollution> {
    return this.http.get<IAirPollution>(
      `${MAIN_ENDPOINT}${MAIN_PATH_PART}air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${environment.weatherApiKey}`
    );
  }

  public getHistoricalAirPollutionData(
    lat: number,
    lon: number,
    start: string,
    end: string
  ): Observable<IAirPollution> {
    return this.http.get<IAirPollution>(
      `${MAIN_ENDPOINT}${MAIN_PATH_PART}air_pollution/history?lat=${lat}&lon=${lon}&start=${Number.parseInt(
        start
      )}&end=${Number.parseInt(end)}&appid=${environment.weatherApiKey}`
    );
  }
}
