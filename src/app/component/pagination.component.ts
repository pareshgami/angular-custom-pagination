import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

interface Page {
  label: any;
  value: any;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Input() paginationRange: number = 7;
  @Output() pageUpdated = new EventEmitter<number>();
  pages: Page[] = [];
  noOfPage = 0;
  constructor() { }

  ngOnInit(): void {
    this.pages = this.createPageArray(this.currentPage, this.itemsPerPage, this.totalItems, this.paginationRange);
  }

  createPageArray(currentPage: number, itemsPerPage: number, totalItems: number, paginationRange: number): Page[] {
    paginationRange = +paginationRange;
    let pages = [];
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
    const halfWay = Math.ceil(paginationRange / 2);

    const isStart = currentPage <= halfWay;
    const isEnd = totalPages - halfWay < currentPage;
    const isMiddle = !isStart && !isEnd;

    let ellipsesNeeded = paginationRange < totalPages;
    let i = 1;

    while (i <= totalPages && i <= paginationRange) {
      let label;
      let pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
      let openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
      let closingEllipsesNeeded = (i === paginationRange - 1 && (isMiddle || isStart));
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        label = '...';
      } else {
        label = pageNumber;
      }
      pages.push({
        label: label,
        value: pageNumber
      });
      i++;
    }
    return pages;
  }

  private calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
    let halfWay = Math.ceil(paginationRange / 2);
    if (i === paginationRange) {
      return totalPages;
    } else if (i === 1) {
      return i;
    } else if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + i;
      } else if (halfWay < currentPage) {
        return currentPage - halfWay + i;
      } else {
        return i;
      }
    } else {
      return i;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.noOfPage = Math.ceil(this.totalItems/this.itemsPerPage);
    this.pages = this.createPageArray(this.currentPage, this.itemsPerPage, this.totalItems, this.paginationRange);
  }

  changePage(page: Page) {
    this.currentPage = page.value;
    this.pages = this.createPageArray(this.currentPage, this.itemsPerPage, this.totalItems, this.paginationRange);
    this.pageUpdated.emit(page.value);
  }

  goBack() {
    this.currentPage--;
    this.pageUpdated.emit(this.currentPage);
  }

  goNext() {
    this.currentPage++;
    this.pageUpdated.emit(this.currentPage);
  }

}
