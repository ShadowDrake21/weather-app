import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { ICityCoords } from '../../../../../shared/models/geocoding.model';
import { AirPollutionService } from '../../../../../core/services/air-pollution.service';
import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';
import { PaginationService } from '../../../../../core/services/pagination.service';
import { IHttpError } from '../../../../../shared/models/error.model';
import { PagesProportions } from '../../../../../shared/models/generals.model';

@Component({
  selector: 'app-forecast-air-pollution',
  templateUrl: './forecast-air-pollution.component.html',
  styleUrl: './forecast-air-pollution.component.css',
  providers: [PaginationService],
})
export class ForecastAirPollutionComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input({ required: true, alias: 'coords' }) coords$ =
    new Observable<ICityCoords>();

  constructor(private airPollutionService: AirPollutionService) {}

  airPollutionForecastError$ = new Observable<IHttpError | null>();
  airPollutionForecast$$ = new BehaviorSubject<IAirPollutionList[]>([]);
  visibleAirPollutionForecast$$ = new Subject<IAirPollutionList[]>();
  pages$ = new Observable<PagesProportions>();

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
        .subscribe({
          next: (pollutionData) => {
            this.airPollutionForecast$$.next(pollutionData.list);
          },
          error: (error) =>
            (this.airPollutionForecastError$ = of({
              name: `Error while getting city air polluion (${error.name})`,
              message: error.message,
            } as IHttpError)),
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
    this.airPollutionForecast$$.complete();
  }
}
