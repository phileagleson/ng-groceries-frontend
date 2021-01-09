import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<string[]>([])
  errors: Observable<string[]> = this.errorSubject.asObservable().pipe(filter((messages) => messages.length > 0))
  constructor() {}

  showError(...errors: string[]) {
    this.errorSubject.next(errors)
  }
}
