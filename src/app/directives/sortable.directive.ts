import { Directive, Input, ElementRef, HostListener } from '@angular/core'
import { Sort } from '../utils/sort'

@Directive({
  selector: 'th[appSortable]'
})
export class AppSortDirective {
  @Input() appSortable: Array<any> = []

  constructor(private targetElement: ElementRef) {}

  @HostListener('click')
  sortData() {
    const sort = new Sort()
    const elem = this.targetElement.nativeElement
    const order = elem.getAttribute('data-order')
    const type = elem.getAttribute('data-type')
    const property = elem.getAttribute('data-name')

    if (order === 'desc') {
      this.appSortable.sort(sort.startSort(property, order, type))
      elem.setAttribute('data-order', 'asc')
    } else {
      this.appSortable.sort(sort.startSort(property, order, type))
      elem.setAttribute('data-order', 'desc')
    }
  }
}
