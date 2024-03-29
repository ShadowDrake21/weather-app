import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { PagesProportions } from '../../shared/models/generals.model';

@Injectable()
export class PaginationService {
  private items$$ = new BehaviorSubject<any[]>([]);
  public visibleItems$$ = new BehaviorSubject<any[]>([]);
  public currentPage$$ = new BehaviorSubject<number>(1);
  private itemsPerPage$$ = new BehaviorSubject<number>(5);

  public setItems(itemsIn$$: Subject<any>): void {
    itemsIn$$.subscribe((value: any) => {
      this.items$$.next(value);
    });
    this.updateVisibleItems();
  }

  public setItemsPerPage(value: number) {
    this.itemsPerPage$$.next(value);
  }

  private updateVisibleItems() {
    const startIndex =
      (this.currentPage$$.value - 1) * this.itemsPerPage$$.value;
    const endIndex = startIndex + this.itemsPerPage$$.value;
    this.visibleItems$$.next(this.items$$.value.slice(startIndex, endIndex));
  }

  private setCurrentPage(page: number): void {
    this.currentPage$$.next(page);
    this.updateVisibleItems();
  }

  public nextPage(): void {
    const nextPage = this.currentPage$$.value + 1;
    if (nextPage <= this.calcNumPages()) {
      this.setCurrentPage(nextPage);
    }
  }

  public previousPage(): void {
    const prevPage = this.currentPage$$.value - 1;
    if (prevPage >= 1) {
      this.setCurrentPage(prevPage);
    }
  }

  public calcNumPages(): number {
    return Math.ceil(this.items$$.value.length / this.itemsPerPage$$.value);
  }

  public formPagesObservable(): Observable<PagesProportions> {
    return of({
      currentPage: this.currentPage$$.value,
      allPages: this.calcNumPages(),
    } as PagesProportions);
  }
}
