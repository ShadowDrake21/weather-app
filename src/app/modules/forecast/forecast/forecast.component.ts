import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';

import { ForecastService } from '../../../core/services/forecast.service';
import { GeocodingService } from '../../../core/services/geocoding.service';
import {
  ICityCoords,
  ILocalNames,
} from '../../../shared/models/geocoding.model';
import { IForecast } from '../../../shared/models/forecast.model';
import { IHttpError } from '../../../shared/models/error.model';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css',
})
export class ForecastComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private forecastService: ForecastService,
    private geocodingService: GeocodingService,
    private router: Router
  ) {}

  queryCityName$ = new Observable<string | null>();
  queryBgPath$ = new Observable<string | null>();

  activeCityName$ = new Observable<string | null>();

  cityCoordsError$ = new Observable<IHttpError | null>();
  cityCoords$ = new Observable<ICityCoords>();
  private _alternativeNames$ = new Observable<[string, string][]>();
  cityAlternativeNames$ = new Observable<[string, string][]>();
  cityForecast$ = new Observable<IForecast>();

  @ViewChild('changer') titleChanger!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.queryCityName$ = this.activatedRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('city'))
    );
    this.queryCityName$.subscribe((cityName) => {
      if (cityName) {
        this.getCityCoords(cityName);
        this.getCityForecast();
      }
    });

    this.activeCityName$ = this.queryCityName$;

    this.queryBgPath$ = this.activatedRoute.queryParamMap.pipe(
      map((params: ParamMap) => params.get('bg'))
    );
  }

  public getCityCoords(cityName: string) {
    this.geocodingService
      .getCoordinatesByLocationName(cityName, undefined, undefined, 1)
      .pipe(
        map((data) => {
          return data[0];
        }),
        switchMap((data) => {
          const cords: ICityCoords = { lat: data.lat, lon: data.lon };
          this.setAlternativeNames(data.local_names);
          return of(cords);
        })
      )
      .subscribe({
        next: (cords) => {
          this.cityCoords$ = of(cords);
          this.getCityForecast();
        },
        error: (error) => {
          this.cityCoordsError$ = of({
            name: `Error while getting city coordinates (${error.name})`,
            message: error.message,
          } as IHttpError);
        },
      });
  }

  public getCityForecast() {
    this.cityCoords$.subscribe((coordinates) => {
      this.cityForecast$ =
        this.forecastService.getFiveDaysForecastByCoordinates(
          coordinates.lat,
          coordinates.lon
        );
    });
  }

  private setAlternativeNames(localNames: ILocalNames | undefined) {
    let tmpCityAlternativeNames$: Observable<ILocalNames | undefined> =
      of(localNames);
    this.cityAlternativeNames$ = this.formatAltNamesObservable(
      tmpCityAlternativeNames$
    );
    this._alternativeNames$ = this.cityAlternativeNames$;
  }

  public formatAltNamesObservable(
    stream: Observable<ILocalNames | undefined>
  ): Observable<[string, string][]> {
    let alternativeNamesMap$ = new Observable<[string, string][]>();
    alternativeNamesMap$ = stream.pipe(
      switchMap((names) => {
        if (!names) {
          return of([]);
        }
        return of(Object.entries(names) as [string, string][]);
      })
    );

    return alternativeNamesMap$;
  }

  public toggleTitleChangeDropdown(event: Event) {
    const arrowEl = event.target as HTMLElement;
    const wrapperEl = arrowEl.closest('.forecast__title-changer__img-wrapper');
    let dropdownEl = wrapperEl?.nextElementSibling;

    arrowEl.style.transform = dropdownEl?.classList.contains('active')
      ? ''
      : 'rotate(180deg)';

    if (dropdownEl) {
      dropdownEl?.classList.toggle('unactive');
      dropdownEl?.classList.toggle('active');
    }
  }

  public onTitleChange(value: [string, string]) {
    this.activeCityName$ = of(`${value[0].toUpperCase()} - ${value[1]}`);
    this.cityAlternativeNames$ = this._alternativeNames$.pipe(
      map((names) =>
        names.filter((name: [string, string]) => name[0] !== value[0])
      )
    );
    this.closeDropdown();
  }

  private closeDropdown() {
    const dropdownEl = this.titleChanger.nativeElement.children[1];

    if (dropdownEl?.classList.contains('active')) {
      dropdownEl.classList.remove('active');
      dropdownEl.classList.add('unactive');

      const arrowEl = this.titleChanger.nativeElement.querySelector(
        '.forecast__title-changer__img'
      ) as HTMLElement;
      arrowEl.style.transform = '';
    } else {
      return;
    }
  }

  public backToMain() {
    this.router.navigateByUrl('/main');
  }
}
