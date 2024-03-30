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
  delay,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { ICityCoords } from '../../../../../shared/models/geocoding.model';
import { AirPollutionService } from '../../../../../core/services/air-pollution.service';
import { PaginationService } from '../../../../../core/services/pagination.service';
import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';
import { IHttpError } from '../../../../../shared/models/error.model';
import { PagesProportions } from '../../../../../shared/models/generals.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  convertDateToUnixTimestamp,
  convertUnixTimestampToUTC,
} from '../../../../../shared/utils/dateAndTime.utils';
import { getAirQualityText } from '../../../../../shared/utils/generals.utils';

@Component({
  selector: 'app-historical-air-pollution',
  templateUrl: './historical-air-pollution.component.html',
  styleUrl: './historical-air-pollution.component.css',
  providers: [PaginationService],
})
export class HistoricalAirPollutionComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input({ required: true, alias: 'coords' }) coords$!: Observable<ICityCoords>;
  constructor(
    private airPollutionService: AirPollutionService,
    private paginationService: PaginationService
  ) {}

  isFirstSearch$: Observable<boolean> = of(true);

  historicalAirPollutionError$ = new Observable<IHttpError | null>();
  loadingPollutionData$$ = new BehaviorSubject<boolean>(false);
  historicalAirPollution$$ = new BehaviorSubject<IAirPollutionList[]>([]);
  visibleHistoricalAirPollution$$ = new BehaviorSubject<IAirPollutionList[]>(
    []
  );
  pages$ = new Observable<PagesProportions>();

  minDate = new Date('November 27, 2020 00:00:00');
  maxDate = new Date();

  historicAirPollutionForm = new FormGroup({
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null, [Validators.required]),
  });

  private unsubscribe$$ = new Subject<void>();

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coords$'] && !changes['coords$'].firstChange) {
      console.log('historical', this.coords$);
    }
  }

  onSearchPollution() {
    this.unsubscribe$$.next();

    this.historicalAirPollution$$.next([]);
    this.paginationService.currentPage$$.next(1);
    const startUnix: number = convertDateToUnixTimestamp(
      this.historicAirPollutionForm.value.startDate!
    );
    const endUnix: number = convertDateToUnixTimestamp(
      this.historicAirPollutionForm.value.endDate!
    );
    this.getHistoricalAirPollution(startUnix, endUnix);
  }

  public getHistoricalAirPollution(start: number, end: number) {
    if (this.coords$) {
      this.loadingPollutionData$$.next(true);
      this.historicalAirPollution$$.next([]);
      this.coords$
        .pipe(
          switchMap((coords) =>
            this.airPollutionService.getHistoricalAirPollutionData(
              coords.lat,
              coords.lon,
              start,
              end
            )
          ),
          tap(() => (this.isFirstSearch$ = of(false))),
          takeUntil(this.unsubscribe$$),
          delay(2000)
        )
        .subscribe({
          next: (pollutionData) => {
            this.historicalAirPollution$$.next(pollutionData.list);
            this.loadingPollutionData$$.next(false);
            console.log('pollutionData', pollutionData);
          },
          error: (error) =>
            (this.historicalAirPollutionError$ = of({
              name: `Error while getting city air polluion (${error.name})`,
              message: error.message,
            } as IHttpError)),
        });
    }
  }

  private formPage() {
    this.pages$ = this.paginationService.formPagesObservable();
  }

  public onNextPage = (): void => {
    this.paginationService.nextPage();
    this.formPage();
  };

  public onPreviousPage = (): void => {
    this.paginationService.previousPage();
    this.formPage();
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
    this.historicalAirPollution$$.complete();
  }
}
