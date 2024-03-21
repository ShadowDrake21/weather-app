import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../../../core/services/weather.service';
import { IWeatherByNow } from '../../../shared/models/weather.model';
import { FormControl, FormGroup } from '@angular/forms';
import { UnsplashService } from '../../../core/services/unsplash.service';
import { IPhotoInfo } from '../../../shared/models/photo.model';
import { shuffleArray } from '../../../shared/utils/arrrays.utils';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent implements OnInit {
  constructor(
    private weatherService: WeatherService,
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
  activePhoto = new Observable<IPhotoInfo | null>();

  ngOnInit(): void {
    this.activePhoto = of(this.initialActivePhoto);
  }

  public onCityNameInput() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1000),
        filter(() => !!this.searchForm.value.cityName),
        tap((term) => {
          this.getPhotosByCityName(term.cityName ?? '');
        }),
        switchMap(() =>
          this.weatherService.getCurrentWeatherByName(
            this.searchForm.value.cityName ?? ''
          )
        )
      )
      .subscribe({
        next: (observable) => {
          this.weather$$.next(observable);
        },
        error: (error) => {
          console.error('Error while fetching weather: ', error);
        },
      });
  }

  public getPhotosByCityName(cityName: string): void {
    this.unsplashService
      .getPhotos(cityName)
      .subscribe((photos: IPhotoInfo[]) => {
        const shuffledPhotos = shuffleArray(photos);
        // this.activePhoto = of(this.photos$$.getValue()?.[0]!);
        this.photos$$.next(shuffledPhotos);
      });
  }
}
