import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  concatMap,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-forecast-slider',
  templateUrl: './forecast-slider.component.html',
  styleUrl: './forecast-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastSliderComponent implements OnInit, OnDestroy {
  @ViewChild('items', { static: true, read: ElementRef })
  slider!: ElementRef<HTMLDivElement>;

  active$!: Observable<boolean>;

  panels = [...Array(25).keys()].map((i) => (i < 9 ? `0${i + 1}` : `${i + 1}`));

  subscription = new Subscription();

  ngOnInit(): void {
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
        concatMap((moveDownEvent) => {
          const startX = moveDownEvent.pageX - sliderNative.offsetLeft;
          const scrollLeft = sliderNative.scrollLeft;
          return mouseMove$.pipe(
            filter((moveEvent) => moveEvent instanceof MouseEvent),
            map((moveEvent) => moveEvent as MouseEvent),
            tap((moveEvent) => moveEvent.preventDefault()),
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
