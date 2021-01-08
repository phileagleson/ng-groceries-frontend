import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { concatMap, finalize, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  // eslint-ignore-next-line
  loading: Observable<boolean> = this.loadingSubject.asObservable()

  constructor() {
    console.log('Loading service created...')
  }

  showLoaderUntilCompleted<T>(obs: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn),
      concatMap(() => obs),
      finalize(() => this.loadingOff())
    )
  }

  loadingOn() {
    this.loadingSubject.next(true)
  }

  loadingOff() {
    this.loadingSubject.next(false)
  }
}
