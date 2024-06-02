import { HttpClient } from '@angular/common/http';
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
  private proxyCurrentTimeUrl = `${MAIN_CORS_ENDPOINT}/api/time/current`;
  private proxyTimezoneUrl = `${MAIN_CORS_ENDPOINT}/api/time/zone`;

  constructor(private http: HttpClient) {}

  public getCurrentTimeByCoordinantes(
    latitude: number,
    longitude: number
  ): Observable<ITime> {
    const url = `${this.proxyCurrentTimeUrl}?latitude=${latitude}&longitude=${longitude}`;

    return this.http.get<ITime>(url);
  }

  public getTimezoneByZoneName(zoneName: string): Observable<ITime> {
    const url = `${this.proxyTimezoneUrl}?zoneName=${zoneName}`;
    return this.http.get<ITime>(url);
  }
}
