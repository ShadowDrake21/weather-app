import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../../../core/services/weather.service';
import { IWeatherByNow } from '../../../shared/models/weather.model';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}

  weather$ = new Observable<IWeatherByNow>();

  ngOnInit(): void {
    this.getWeatherInfoByInput();
  }

  public getWeatherInfoByInput() {
    this.weather$ = this.weatherService.getCurrentWeatherByName('Los Angeles');
    this.weather$.subscribe((res) => {
      console.log(res);
    });
  }
}
