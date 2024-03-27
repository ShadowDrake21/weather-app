import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  startWith,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';

import { IForecastPoint } from '../../../../../shared/models/forecast.model';
import { ArrowsType } from '../../../../../shared/models/generals.model';

@Component({
  selector: 'app-forecast-slider',
  templateUrl: './forecast-slider.component.html',
  styleUrl: './forecast-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastSliderComponent implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'items' }) sliderItems: IForecastPoint[] = [];
  @ViewChild('items', { static: true, read: ElementRef })
  slider!: ElementRef<HTMLDivElement>;
  active$!: Observable<boolean>;
  subscription = new Subscription();
  arrows$$ = new BehaviorSubject<ArrowsType>({
    leftArrow: false,
    rightArrow: true,
  });
  ngOnInit(): void {
    this.sliderFunctionality();
  }

  public sliderFunctionality() {
    const sliderNative = this.slider.nativeElement;
    const mouseDown$ = fromEvent(sliderNative, 'mousedown');
    const mouseLeave$ = fromEvent(sliderNative, 'mouseleave');
    const mouseUp$ = fromEvent(sliderNative, 'mouseup');
    const stop$ = merge(mouseLeave$, mouseUp$);
    const mouseMove$ = fromEvent(sliderNative, 'mousemove');

    this.active$ = merge(
      mouseDown$.pipe(map(() => true)),
      stop$.pipe(map(() => false))
    ).pipe(startWith(false));

    this.subscription = mouseDown$
      .pipe(
        filter((moveDownEvent) => moveDownEvent instanceof MouseEvent),
        map((moveDownEvent) => moveDownEvent as MouseEvent),
        tap(() => {
          this.arrows$$.next({ leftArrow: true, rightArrow: true });
        }),
        concatMap((moveDownEvent) => {
          const startX = moveDownEvent.pageX - sliderNative.offsetLeft;
          const scrollLeft = sliderNative.scrollLeft;
          return mouseMove$.pipe(
            filter((moveEvent) => moveEvent instanceof MouseEvent),
            map((moveEvent) => moveEvent as MouseEvent),
            tap((moveEvent) => moveEvent.preventDefault()),
            tap(() => {
              if (sliderNative.scrollLeft === 0) {
                this.arrows$$.next({
                  leftArrow: false,
                  rightArrow: true,
                });
              } else if (
                sliderNative.offsetWidth + sliderNative.scrollLeft >=
                sliderNative.scrollWidth
              ) {
                this.arrows$$.next({
                  leftArrow: true,
                  rightArrow: false,
                });
              } else {
                this.arrows$$.next({
                  leftArrow: true,
                  rightArrow: true,
                });
              }
            }),
            map((e) => {
              const x = e.pageX - sliderNative.offsetLeft;
              const walk = (x - startX) * 3;
              sliderNative.scrollLeft = scrollLeft - walk;
            }),
            takeUntil(stop$)
          );
        })
      )
      .subscribe();
  }

  public moveSlider(direction: 'left' | 'right') {
    const sliderNative = this.slider.nativeElement;
    const scrollLeft = sliderNative.scrollLeft;
    const step = 300;

    if (direction === 'right') {
      sliderNative.scrollLeft += step;
    } else {
      sliderNative.scrollLeft -= step;
    }

    setTimeout(() => {
      this.setArrowsVisibility(scrollLeft, step, sliderNative);
    }, 100);
  }

  private setArrowsVisibility(
    scrollLeft: number,
    step: number,
    sliderNative: HTMLElement
  ) {
    const isAtStart = scrollLeft - step <= 15;
    const isAtEnd =
      sliderNative.offsetWidth + scrollLeft >= sliderNative.scrollWidth - step;
    this.arrows$$.next({
      leftArrow: !isAtStart,
      rightArrow: !isAtEnd,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
