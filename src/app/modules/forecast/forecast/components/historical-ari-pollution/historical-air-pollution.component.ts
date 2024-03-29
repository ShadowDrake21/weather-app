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
})
export class HistoricalAirPollutionComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input({ required: true, alias: 'coords' }) coords$!: Observable<ICityCoords>;
  // fix THE problem with air pollutions!
  constructor(
    private airPollutionService: AirPollutionService,
    private paginationService: PaginationService
  ) {}

  historicalPollutionError$ = new Observable<IHttpError | null>();
  historicalAirPollution$$ = new BehaviorSubject<IAirPollutionList[]>([]);
  visibleHistoricalAirPollution$$ = new Subject<IAirPollutionList[]>();
  pages$ = new Observable<PagesProportions>();

  minDate = new Date('November 27, 2020 00:00:00');
  maxDate = new Date();

  historicAirPollutionForm = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  private unsubscribe$$ = new Subject<void>();

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coords$'] && !changes['coords$'].firstChange) {
      console.log('historical', this.coords$);
    }
  }

  onSearchPollution() {
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
          takeUntil(this.unsubscribe$$)
        )
        .subscribe({
          next: (pollutionData) => {
            this.historicalAirPollution$$.next(pollutionData.list);
            this.historicalAirPollution$$.subscribe(console.log);
            this.paginationService.setItemsPerPage(6);
            this.paginationService.setItems(this.historicalAirPollution$$);
            this.formPage();
          },
          error: (error) =>
            (this.historicalPollutionError$ = of({
              name: `Error while getting city air polluion (${error.name})`,
              message: error.message,
            } as IHttpError)),
        });

      this.paginationService.visibleItems$$.subscribe((visibleItems) => {
        this.visibleHistoricalAirPollution$$.next(visibleItems);
        this.visibleHistoricalAirPollution$$.subscribe(console.log);
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
