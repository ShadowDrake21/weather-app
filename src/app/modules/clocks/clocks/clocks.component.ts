import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  catchError,
  delay,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';

import { TimeService } from '../../../core/services/time.service';
import { europeAreas } from '../../../shared/static/world-areas.static';
import { IClockTime } from '../../../shared/models/time.model';
import {
  calculateInitialDelay,
  calculateUpdatedDate,
} from '../../../shared/utils/dateAndTime.utils';
import { IWorldAreas } from '../../../shared/models/world-areas.model';
import { UnsplashService } from '../../../core/services/unsplash.service';
import { IPhotoInfo } from '../../../shared/models/photo.model';
import { IHttpError } from '../../../shared/models/error.model';

@Component({
  selector: 'app-clocks',
  templateUrl: './clocks.component.html',
  styleUrl: './clocks.component.css',
})
export class ClocksComponent implements OnInit, OnDestroy {
  constructor(
    private timeService: TimeService,
    private unsplashService: UnsplashService
  ) {}

  isLoading$ = new Observable<boolean>();

  photo$ = new Observable<IPhotoInfo | null>();
  timesError$!: Observable<IHttpError>;
  allEuropeTimes$: Observable<IClockTime | null>[] = [];

  private destroy$$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.getAllCitiesCurrentTime(europeAreas);
    this.getPhotosByCityName();
  }

  public getAllCitiesCurrentTime(areas: IWorldAreas): void {
    this.isLoading$ = of(true);

    const timeObservables: Observable<IClockTime | null>[] =
      areas.countriesCapitals.map((city) =>
        this.timeService
          .getTimezoneByZoneName(`${europeAreas.areaName}/${city}`)
          .pipe(
            switchMap((result: any) =>
              timer(calculateInitialDelay(), 1000).pipe(
                takeUntil(this.destroy$$),
                map(
                  () =>
                    ({
                      time: calculateUpdatedDate(
                        result.raw_offset,
                        result.dst_offset
                      ),
                      timezone: result.timezone,
                    } as IClockTime)
                )
              )
            ),
            catchError((error: Error) => {
              this.timesError$ = of({
                name: `Error fetching timezone (${error.name})`,
                message: error.message,
              } as IHttpError);
              return of(null);
            })
          )
      );

    let completedSubsCount = 0;
    timeObservables.forEach((observable) => {
      observable.pipe(delay(1500)).subscribe({
        next: () => {
          completedSubsCount++;
          if (completedSubsCount === areas.countriesCapitals.length) {
            this.isLoading$ = of(false);
          }
        },
      });
    });

    this.allEuropeTimes$ = timeObservables;
  }

  public getPhotosByCityName(): void {
    // this.unsplashService
    //   .getPhotos('Europe')
    //   .subscribe((photos: IPhotoInfo[]) => {
    //     console.log('photos', photos);
    //     const shuffledPhotos = shuffleArray(photos);
    //     this.photo$ = of(
    //       shuffledPhotos[Math.floor(Math.random() * shuffledPhotos.length)]
    //     );
    //   });
    this.photo$ = of({
      url: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODEyOTZ8MHwxfHNlYXJjaHw4fHxFdXJvcGV8ZW58MHx8fHwxNzExNjEwNjU2fDA&ixlib=rb-4.0.3&q=80&w=1080',
      orientation: 'landscape',
    } as IPhotoInfo);
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
