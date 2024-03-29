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
import { getAirQualityText } from '../../../../../shared/utils/generals.utils';
import { convertUnixTimestampToUTC } from '../../../../../shared/utils/dateAndTime.utils';
import { PaginationService } from '../../../../../core/services/pagination.service';
import { IHttpError } from '../../../../../shared/models/error.model';

type PagesProportions = {
  currentPage: number;
  allPages: number;
};

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

  constructor(
    private airPollutionService: AirPollutionService,
    private paginationService: PaginationService
  ) {}

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
            this.paginationService.setItemsPerPage(6);
            this.paginationService.setItems(this.airPollutionForecast$$);
            this.formPagesObservable();
          },
          error: (error) =>
            (this.airPollutionForecastError$ = of({
              name: `Error while getting city air polluion (${error.name})`,
              message: error.message,
            } as IHttpError)),
        });

      this.paginationService.visibleItems$$.subscribe((visibleItems) => {
        this.visibleAirPollutionForecast$$.next(visibleItems);
      });
    }
  }

  private formPagesObservable() {
    this.pages$ = of({
      currentPage: this.paginationService.currentPage$$.value,
      allPages: this.paginationService.calcNumPages(),
    } as PagesProportions);
  }

  public onNextPage = (): void => {
    this.paginationService.nextPage();
    this.formPagesObservable();
  };

  public onPreviousPage = (): void => {
    this.paginationService.previousPage();
    this.formPagesObservable();
  };

  public isFirstOrLastPage = (type: 'prev' | 'next'): boolean => {
    if (type === 'prev') {
      return this.paginationService.currentPage$$.value === 1;
    } else {
      return (
        this.paginationService.currentPage$$.value ===
        this.paginationService.calcNumPages()
      );
    }
  };

  public getAirQualityText = getAirQualityText;
  public convertUnixTimestampToUTC = convertUnixTimestampToUTC;

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
    this.airPollutionForecast$$.complete();
  }
}
