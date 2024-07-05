import {
  BehaviorSubject,
  catchError,
  delay,
  map,
  Observable,
  of,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { WeatherService } from '../../../core/services/weather.service';
import { IWeatherByNow } from '../../../shared/models/weather.model';
import { UnsplashService } from '../../../core/services/unsplash.service';
import { IPhotoInfo } from '../../../shared/models/photo.model';
import { shuffleArray } from '../../../shared/utils/arrrays.utils';
import { TimeService } from '../../../core/services/time.service';
import { ITimezone } from '../../../shared/models/time.model';
import { AirPollutionService } from '../../../core/services/air-pollution.service';
import { IAirPollutionList } from '../../../shared/models/airpollution.model';
import { IHttpError } from '../../../shared/models/error.model';
import {
  calculateInitialDelay,
  calculateUpdatedDate,
} from '../../../shared/utils/dateAndTime.utils';
import { getErrorObject } from '../../../shared/utils/errorHandling.utils';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent implements OnInit, OnDestroy {
  constructor(
    private weatherService: WeatherService,
    private airPollutionService: AirPollutionService,
    private timeService: TimeService,
    private unsplashService: UnsplashService
  ) {}

  searchForm = new FormGroup({
    cityName: new FormControl(''),
  });

  initialActivePhoto: IPhotoInfo = {
    url: '/assets/background-img.jpg',
    orientation: 'landscape',
  };

  clocksLinkClicked$$ = new BehaviorSubject<boolean>(false);
  detailedInfoError$ = new Observable<IHttpError | null>();

  weather$$ = new BehaviorSubject<IWeatherByNow | null>(null);
  weatherError$ = new Observable<IHttpError>();

  airPollution$$ = new BehaviorSubject<IAirPollutionList[] | null>(null);
  airPolutionError$ = new Observable<IHttpError>();

  photos$$ = new BehaviorSubject<IPhotoInfo[] | null>(null);
  activePhoto$ = new Observable<IPhotoInfo | null>();

  timezone$ = new Observable<ITimezone | null>();
  time$ = new Observable<Date | null>();
  timeError$ = new Observable<IHttpError | null>();

  blockElements$$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    if (localStorage.getItem('clocksClicked') === 'true') {
      this.clocksLinkClicked$$.next(true);
    } else {
      this.clocksLinkClicked$$.next(false);
    }
    this.activePhoto$ = of(this.initialActivePhoto);
  }

  public onCityNameSubmit() {
    if (!this.searchForm.value.cityName) return;

    if (this.weather$$) {
      this.weather$$.next(null);
    }
    if (this.airPollution$$) {
      this.airPollution$$.next(null);
    }

    this.weatherService
      .getCurrentWeatherByName(this.searchForm.value.cityName)
      .pipe(
        tap(() => this.setToLocalStorage(true)),
        catchError((error) => {
          this.catchErrorByIncorrectName(error);
          return of(null);
        })
      )
      .subscribe({
        next: (weather) => {
          if (!weather) return;
          this.weather$$.next(weather);
          this.getCityTime(weather.coord.lat, weather.coord.lon);
          this.getCurrentAirPollution(weather.coord.lat, weather.coord.lon);
          this.getPhotosByCityName(weather.name);
        },
        error: (error) => {
          this.weatherError$ = of(
            getErrorObject(error.name, error.error.message)
          );
        },
      });
  }

  private setToLocalStorage(value: boolean) {
    localStorage.setItem('wasSearch', value.toString());
  }

  private removeFromLocalStorage() {
    localStorage.removeItem('wasSearch');
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    if (localStorage.getItem('wasSearch')) {
      localStorage.removeItem('wasSearch');
    }

    if (localStorage.getItem('clocksClicked')) {
      localStorage.removeItem('clocksClicked');
    }
  }

  public handleClocksClick() {
    this.clocksLinkClicked$$.next(true);
    localStorage.setItem('clocksClicked', JSON.stringify(true));

    timer(30000).subscribe(() => {
      localStorage.removeItem('clocksClicked');
    });
  }

  private catchErrorByIncorrectName(error: any) {
    this.detailedInfoError$ = of(
      getErrorObject(
        'Weather and air pollution ' + error.name,
        error.error.message ??
          'Unknown Error. You will be able to try again after 5 sec'
      )
    );
    this.time$ = of(null);
    this.timezone$ = of(null);
    this.activePhoto$ = of(this.initialActivePhoto);
    this.timeError$ = of(getErrorObject(error.name, error.error.message));
    this.searchForm.disable();
    this.blockIfError();
  }

  public getCityTime(latitude: number, longitude: number) {
    this.timeService
      .getCurrentTimeByCoordinantes(latitude, longitude)
      .subscribe({
        next: ({ timeZone }) => {
          this.timeService
            .getTimezoneByZoneName(timeZone)
            .subscribe((res: any) => {
              this.timezone$ = of(res);
              const initialDelay = calculateInitialDelay();
              this.time$ = timer(initialDelay, 1000).pipe(
                map(() => calculateUpdatedDate(res.raw_offset, res.dst_offset))
              );
            });
        },
        error: (error) => {
          const errorObj: IHttpError = {
            name: error.name,
            message: error.error,
          };
          this.timeError$ = of(errorObj);
        },
      });
  }

  public getCurrentAirPollution(latitude: number, longitude: number) {
    this.airPollutionService
      .getCurrentAirPollutionData(latitude, longitude)
      .pipe(
        catchError((error) => {
          this.airPolutionError$ = of(
            getErrorObject(error.name, error.error.message)
          );
          return of(null);
        }),
        map((data) => {
          return data!.list;
        })
      )
      .subscribe({
        next: (list) => {
          this.airPollution$$.next(list);
        },
        error: (error) => {
          const errorObj: IHttpError = {
            name: error.name,
            message: error.error.message,
          };
          this.airPolutionError$ = of(errorObj);
        },
      });
  }

  public getPhotosByCityName(cityName: string): void {
    this.unsplashService
      .getPhotos(cityName)
      .subscribe((photos: IPhotoInfo[]) => {
        const shuffledPhotos = shuffleArray(photos);
        this.photos$$.next(shuffledPhotos);
        this.activePhoto$ = of(this.photos$$.getValue()?.[0]!);
      });
  }

  public onReset() {
    this.detailedInfoError$ = of(null);
    this.timeError$ = of(null);
    this.searchForm.enable();
    this.searchForm.controls.cityName.setValue('');
  }

  public isBtnDisabled = (): boolean => {
    return this.searchForm.disabled;
  };

  private blockIfError() {
    this.blockElements$$.next(true);

    this.blockElements$$
      .pipe(delay(5000))
      .subscribe(() => this.blockElements$$.next(false));
  }

  ngOnDestroy(): void {
    this.removeFromLocalStorage();
  }
}
