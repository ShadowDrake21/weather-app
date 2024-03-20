import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MAIN_ENDPOINT } from '../constants/main.constans';
import { environment } from '../../../environments/environment.development';
import {
  IGeocoding,
  IGeocodingByZipPost,
} from '../../shared/models/geocoding.model';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  public getCoordinatesByLocationName(
    cityName: string,
    stateCode?: string,
    countryCode?: string,
    limit?: number
  ): Observable<IGeocoding> {
    return this.http.get<IGeocoding>(
      `${MAIN_ENDPOINT}geo/1.0/direct?q=${cityName}` +
        (stateCode ? `,${stateCode}` : '') +
        (countryCode ? `,${countryCode}` : '') +
        `&limit=${limit}&appid=${environment.weatherApiKey}`
    );
  }

  public getCoordinatesByZipCode(
    zipcode: string,
    countryCode: string
  ): Observable<IGeocodingByZipPost> {
    return this.http.get<IGeocodingByZipPost>(
      `${MAIN_ENDPOINT}geo/1.0/zip?zip=${zipcode},${countryCode}&appid=${environment.weatherApiKey}`
    );
  }

  public getLocationByCoordinates(
    lat: number,
    lon: number,
    limit?: number
  ): Observable<IGeocoding> {
    return this.http.get<IGeocoding>(
      `${MAIN_ENDPOINT}geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${environment.weatherApiKey}`
    );
  }
}
