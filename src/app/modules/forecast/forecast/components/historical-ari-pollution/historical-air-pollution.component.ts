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
  timer,
} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ICityCoords } from '../../../../../shared/models/geocoding.model';
import { AirPollutionService } from '../../../../../core/services/air-pollution.service';
import { PaginationService } from '../../../../../core/services/pagination.service';
import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';
import { IHttpError } from '../../../../../shared/models/error.model';
import { PagesProportions } from '../../../../../shared/models/generals.model';
import { convertDateToUnixTimestamp } from '../../../../../shared/utils/dateAndTime.utils';

@Component({
  selector: 'app-historical-air-pollution',
  templateUrl: './historical-air-pollution.component.html',
  styleUrl: './historical-air-pollution.component.css',
  providers: [PaginationService],
})
export class HistoricalAirPollutionComponent implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'coords' }) coords$!: Observable<ICityCoords>;
  constructor(private airPollutionService: AirPollutionService) {}

  isFirstSearch$: Observable<boolean> = of(true);

  historicalAirPollutionError$ = new Observable<IHttpError | null>();
  loadingPollutionData$$ = new Subject<boolean>();
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

  onSearchPollution() {
    this.isFirstSearch$ = of(false);
    this.historicalAirPollution$$.next([]);
    this.loadingPollutionData$$.next(true);

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
            timer(2000).subscribe(() => {
              this.historicalAirPollution$$.next(pollutionData.list);
              this.loadingPollutionData$$.next(false);
            });
          },
          error: (error) =>
            (this.historicalAirPollutionError$ = of({
              name: `Error while getting city air polluion (${error.name})`,
              message: error.message,
            } as IHttpError)),
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
    this.historicalAirPollution$$.complete();
  }
}
