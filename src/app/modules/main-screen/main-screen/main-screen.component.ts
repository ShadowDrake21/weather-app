import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { WeatherService } from '../../../core/services/weather.service';
import { IWeatherByNow } from '../../../shared/models/weather.model';
import { FormControl, FormGroup } from '@angular/forms';
import { UnsplashService } from '../../../core/services/unsplash.service';
import { IPhotoInfo } from '../../../shared/models/photo.model';
import { shuffleArray } from '../../../shared/utils/arrrays.utils';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { TimeService } from '../../../core/services/time.service';
import { ITime } from '../../../shared/models/time.model';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent implements OnInit {
  constructor(
    private weatherService: WeatherService,
    private timeService: TimeService,
    private unsplashService: UnsplashService
  ) {}

  searchForm = new FormGroup({
    cityName: new FormControl(''),
  });

  initialActivePhoto: IPhotoInfo = {
    // url: '/assets/background-img.jpg',
    url: 'https://images.unsplash.com/photo-1629814696209-4f4faf2ab874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODEyOTZ8MHwxfHNlYXJjaHw5fHxLcmFrJUMzJUIzd3xlbnwwfHx8fDE3MTA5NDY3Njd8MA&ixlib=rb-4.0.3&q=80&w=1080',
    title: 'Welcome!',
  };

  weather$$ = new Subject<IWeatherByNow>();
  photos$$ = new BehaviorSubject<IPhotoInfo[] | null>(null);
  activePhoto$ = new Observable<IPhotoInfo | null>();
  time$ = new Observable<ITime>();

  ngOnInit(): void {
    this.activePhoto$ = of(this.initialActivePhoto);
  }

  public onCityNameSubmit() {
    if (!this.searchForm.value.cityName) return;

    this.weatherService
      .getCurrentWeatherByName(this.searchForm.value.cityName)

      .subscribe((weather) => {
        this.weather$$.next(weather);
        this.getCityTime(weather.coord.lat, weather.coord.lon);
        // this.getPhotosByCityName(weather.name);
      });
  }

  public getCityTime(latitude: number, longitude: number) {
    this.timeService
      .getCurrentTimeByCoordinantes(latitude, longitude)
      .subscribe({
        next: (time) => {
          this.time$ = of(time);
        },
        error: (error) => {
          console.error('Error while fetching time:', error);
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
}
