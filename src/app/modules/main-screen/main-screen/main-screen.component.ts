import {
  debounceTime,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../../../core/services/weather.service';
import { IWeatherByNow } from '../../../shared/models/weather.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}

  searchForm = new FormGroup({
    cityName: new FormControl(''),
  });

  weather$$ = new Subject<IWeatherByNow>();

  ngOnInit(): void {
    // this.getWeatherInfoByInput();
  }

  public onCityNameInput() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        filter(() => !!this.searchForm.value.cityName),
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
}
