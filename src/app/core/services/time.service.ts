import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MAIN_CURRENT_PATH_PART,
  MAIN_TIME_ENDPOINT,
  MAIN_WORLDTIME_ENDPOINT,
} from '../constants/time.constants';
import { ITime } from '../../shared/models/time.model';
import { MAIN_CORS_ENDPOINT } from '../constants/cors.constants';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor(private http: HttpClient) {}

  public getCurrentTimeByCoordinantes(
    latitude: number,
    longitude: number
  ): Observable<ITime> {
    const url = `${MAIN_CORS_ENDPOINT}${MAIN_TIME_ENDPOINT}${MAIN_CURRENT_PATH_PART}?latitude=${latitude}&longitude=${longitude}`;

    return this.http.get<ITime>(url);
  }

  public getTimezoneByZoneName(zoneName: string) {
    const url = `${MAIN_CORS_ENDPOINT}${MAIN_WORLDTIME_ENDPOINT}${zoneName}`;
    return this.http.get(url);
  }
}
