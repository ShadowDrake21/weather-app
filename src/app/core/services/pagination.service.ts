import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class PaginationService {
  items$$ = new BehaviorSubject<any[]>([]);
  visibleItems$$ = new BehaviorSubject<any[]>([]);
  currentPage$$ = new BehaviorSubject<number>(1);
  itemsPerPage = 5;

  public setItem(items: any[]): void {
    this.items$$.next(items);
    this.updateVisibleItems();
  }

  public updateVisibleItems() {
    const startIndex = (this.currentPage$$.value - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleItems$$.next(this.items$$.value.slice(startIndex, endIndex));
  }

  public calcNumPages(): number {
    return Math.ceil(this.items$$.value.length / this.itemsPerPage);
  }

  public setCurrentPage(page: number): void {
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
}
