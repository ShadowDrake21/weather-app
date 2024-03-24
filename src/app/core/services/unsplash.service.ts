import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MAIN_PHOTOS_ENDPOINT } from '../constants/unsplash.constants';
import { environment } from '../../../environments/environment.development';
import { IPhotoInfo } from '../../shared/models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  constructor(private http: HttpClient) {}

  public getPhotos(term: string): Observable<IPhotoInfo[]> {
    return this.http
      .get<any>(MAIN_PHOTOS_ENDPOINT, {
        params: {
          query: term,
          client_id: environment.unsplashAccessKey,
        },
      })
      .pipe(
        map((response: any) => {
          return this.extractPhotoInfo(response.results);
        })
      );
  }

  private extractPhotoInfo(results: any[]): IPhotoInfo[] {
    console.log('extract', results);
    return results.map((result) => ({
      url: result.urls.regular,
      orientation: 'landscape',
    }));
  }
}
