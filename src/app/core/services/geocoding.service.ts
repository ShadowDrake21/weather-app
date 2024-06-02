import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MAIN_WEATHER_ENDPOINT } from '../constants/weather.constans';
import { environment } from '../../../environments/environment.development';
import {
  IGeocoding,
  IGeocodingByZipPost,
} from '../../shared/models/geocoding.model';
import { MAIN_CORS_ENDPOINT } from '../constants/cors.constants';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private proxyGeocodingUrl = `${MAIN_CORS_ENDPOINT}/api/geocoding`;

  constructor(private http: HttpClient) {}

  public getCoordinatesByLocationName(
    cityName: string,
    stateCode?: string,
    countryCode?: string,
    limit?: number
  ): Observable<IGeocoding[]> {
    return this.http.get<IGeocoding[]>(
      `${this.proxyGeocodingUrl}?q=${cityName}` +
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
      `${this.proxyGeocodingUrl}?zip=${zipcode},${countryCode}&appid=${environment.weatherApiKey}`
    );
  }

  public getLocationByCoordinates(
    lat: number,
    lon: number,
    limit?: number
  ): Observable<IGeocoding> {
    return this.http.get<IGeocoding>(
      `${this.proxyGeocodingUrl}?lat=${lat}&lon=${lon}&limit=${limit}&appid=${environment.weatherApiKey}`
    );
  }
}
