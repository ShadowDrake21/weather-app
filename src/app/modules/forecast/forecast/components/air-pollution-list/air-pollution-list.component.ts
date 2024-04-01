import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { IAirPollutionList } from '../../../../../shared/models/airpollution.model';
import { PaginationService } from '../../../../../core/services/pagination.service';
import { PagesProportions } from '../../../../../shared/models/generals.model';
import { convertUnixTimestampToUTC } from '../../../../../shared/utils/dateAndTime.utils';
import { getAirQualityText } from '../../../../../shared/utils/generals.utils';

type ScreenMeasurements = { width: number; height: number };

@Component({
  selector: 'app-air-pollution-list',
  templateUrl: './air-pollution-list.component.html',
  styleUrl: './air-pollution-list.component.css',
  providers: [PaginationService],
})
export class AirPollutionListComponent implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'items' }) items$$ = new BehaviorSubject<
    IAirPollutionList[]
  >([]);

  constructor(private paginationService: PaginationService) {}

  visibleItems$$ = new Subject<IAirPollutionList[]>();
  pages$ = new Observable<PagesProportions>();

  screenMeasurements!: ScreenMeasurements;

  ngOnInit(): void {
    this.items$$.subscribe((items) => {
      if (items) {
        this.getScreenMeasurement();
      }
    });
  }

  public setPagination(itemsPerPage: number) {
    this.paginationService.setItemsPerPage(itemsPerPage);
    this.paginationService.setItems(this.items$$);
    this.paginationService.currentPage$$.next(1);
    this.formPage();

    this.paginationService.visibleItems$$.subscribe((visibleItems) => {
      this.visibleItems$$.next(visibleItems);
    });
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

  public getScreenMeasurement() {
    this.screenMeasurements = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    if (this.screenMeasurements.width > 1680) {
      this.setPagination(6);
    } else if (
      this.screenMeasurements.width <= 1680 &&
      this.screenMeasurements.width > 1400
    ) {
      this.setPagination(5);
    } else if (
      this.screenMeasurements.width <= 1400 &&
      this.screenMeasurements.width > 1070
    ) {
      this.setPagination(4);
    } else if (
      this.screenMeasurements.width <= 1070 &&
      this.screenMeasurements.width > 590
    ) {
      this.setPagination(3);
    } else if (
      this.screenMeasurements.width <= 590 &&
      this.screenMeasurements.width > 400
    ) {
      this.setPagination(2);
    } else {
      this.setPagination(1);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenMeasurement();
  }

  public getAirQualityText = getAirQualityText;
  public convertUnixTimestampToUTC = convertUnixTimestampToUTC;

  ngOnDestroy(): void {
    this.items$$.complete();
  }
}
