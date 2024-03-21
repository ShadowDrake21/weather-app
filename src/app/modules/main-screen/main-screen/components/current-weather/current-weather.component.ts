import { Component, Input, OnInit } from '@angular/core';
import { WeatherService } from '../../../../../core/services/weather.service';
import { UnsplashService } from '../../../../../core/services/unsplash.service';
import { Subject } from 'rxjs';
import { IWeatherByNow } from '../../../../../shared/models/weather.model';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css',
})
export class CurrentWeatherComponent implements OnInit {
  constructor(
    private weatherService: WeatherService,
    private unsplashService: UnsplashService
  ) {}

  @Input({ required: true, alias: 'weatherData' }) weather$$ =
    new Subject<IWeatherByNow>();

  ngOnInit(): void {}
}
