import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../../core/services/time.service';
import {
  africanAreas,
  americasAreas,
  asianAreas,
  europeAreas,
} from '../../../shared/static/world-areas.static';
import { map, Observable, switchAll, switchMap, timer } from 'rxjs';
import { ITime } from '../../../shared/models/time.model';
import {
  calculateInitialDelay,
  calculateUpdatedDate,
} from '../../../shared/utils/dateAndTime.utils';
import { IWorldAreas } from '../../../shared/models/world-areas.model';

@Component({
  selector: 'app-clocks',
  templateUrl: './clocks.component.html',
  styleUrl: './clocks.component.css',
})
export class ClocksComponent implements OnInit {
  constructor(private timeService: TimeService) {}

  allEuropeTimes: Observable<Date>[] = [];
  allAmericasTimes: Observable<Date>[] = [];
  allAsianTimes: Observable<Date>[] = [];
  allAfricanTimes: Observable<Date>[] = [];

  ngOnInit(): void {
    this.allEuropeTimes = this.getAllCitiesCurrentTime(europeAreas);
    this.allAmericasTimes = this.getAllCitiesCurrentTime(americasAreas);
    this.allAsianTimes = this.getAllCitiesCurrentTime(asianAreas);
    this.allAfricanTimes = this.getAllCitiesCurrentTime(africanAreas);

    console.log('allEuropeTimes', this.allEuropeTimes);
    console.log('allAmericasTimes', this.allAmericasTimes);
    console.log('allAsianTimes', this.allAsianTimes);
    console.log('allAfricanTimes', this.allAfricanTimes);
  }

  public getAllCitiesCurrentTime(areas: IWorldAreas): Observable<Date>[] {
    const result = areas.countriesCapitals.map((city) =>
      this.timeService
        .getTimezoneByZoneName(`${europeAreas.areaName}/${city}`)
        .pipe(
          switchMap((result: any) => {
            const initialDelay = calculateInitialDelay();
            return timer(initialDelay, 1000).pipe(
              map(() =>
                calculateUpdatedDate(result.raw_offset, result.dst_offset)
              )
            );
          })
        )
    );
    return result;
  }
}
