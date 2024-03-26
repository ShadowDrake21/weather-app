import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ICityCoords } from '../../../../../shared/models/geocoding.model';
import { AirPollutionService } from '../../../../../core/services/air-pollution.service';
import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';

@Component({
  selector: 'app-forecast-air-pollution',
  templateUrl: './forecast-air-pollution.component.html',
  styleUrl: './forecast-air-pollution.component.css',
})
export class ForecastAirPollutionComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input({ required: true, alias: 'coords' }) coords$ =
    new Observable<ICityCoords>();

  constructor(private airPollutionService: AirPollutionService) {}

  airPollutionForecast$$ = new Subject<IAirPollutionList[]>();
  private unsubscribe$$ = new Subject<void>();

  ngOnInit(): void {
    this.getAirPollutionForecast();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coords$'] && !changes['coords$'].firstChange) {
      this.getAirPollutionForecast();
    }
  }

  public getAirPollutionForecast() {
    if (this.coords$) {
      this.coords$
        .pipe(
          switchMap((coords) =>
            this.airPollutionService.getForecastAirPollutionData(
              coords.lat,
              coords.lon
            )
          ),
          takeUntil(this.unsubscribe$$)
        )
        .subscribe((pollutionData) => {
          this.airPollutionForecast$$.next(pollutionData.list);
          console.log(pollutionData.list);
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
    this.airPollutionForecast$$.complete();
  }
}
