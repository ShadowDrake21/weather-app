import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../../core/services/time.service';
import { europeAreas } from '../../../shared/static/world-areas.static';
import { map, Observable, of, switchAll, switchMap, timer } from 'rxjs';
import { IClockTime, ITime } from '../../../shared/models/time.model';
import {
  calculateInitialDelay,
  calculateUpdatedDate,
} from '../../../shared/utils/dateAndTime.utils';
import { IWorldAreas } from '../../../shared/models/world-areas.model';
import { UnsplashService } from '../../../core/services/unsplash.service';
import { IPhotoInfo } from '../../../shared/models/photo.model';
import { shuffleArray } from '../../../shared/utils/arrrays.utils';

@Component({
  selector: 'app-clocks',
  templateUrl: './clocks.component.html',
  styleUrl: './clocks.component.css',
})
export class ClocksComponent implements OnInit {
  constructor(
    private timeService: TimeService,
    private unsplashService: UnsplashService
  ) {}

  allEuropeTimes: Observable<IClockTime>[] = [];
  photo$ = new Observable<IPhotoInfo | null>();

  ngOnInit(): void {
    this.allEuropeTimes = this.getAllCitiesCurrentTime(europeAreas);
    this.getPhotosByCityName();
    console.log('allEuropeTimes', this.allEuropeTimes);
  }

  public getAllCitiesCurrentTime(areas: IWorldAreas): Observable<IClockTime>[] {
    const timeResult = areas.countriesCapitals.map((city) =>
      this.timeService
        .getTimezoneByZoneName(`${europeAreas.areaName}/${city}`)
        .pipe(
          switchMap((result: any) => {
            console.log(result);
            const initialDelay = calculateInitialDelay();
            return timer(initialDelay, 1000).pipe(
              map(() => {
                const updatedTime = calculateUpdatedDate(
                  result.raw_offset,
                  result.dst_offset
                );
                return {
                  time: updatedTime,
                  timezone: result.timezone,
                } as IClockTime;
              })
            );
          })
        )
    );
    return timeResult;
  }

  public getPhotosByCityName(): void {
    this.unsplashService
      .getPhotos('Europe')
      .subscribe((photos: IPhotoInfo[]) => {
        console.log('photos', photos);
        const shuffledPhotos = shuffleArray(photos);
        this.photo$ = of(
          shuffledPhotos[Math.floor(Math.random() * shuffledPhotos.length)]
        );
        this.photo$.subscribe(console.log);
      });
  }
}
