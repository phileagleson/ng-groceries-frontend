import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import jwt_decode from 'jwt-decode'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: any, next: any): Observable<HttpEvent<any>> {
    // clone the request and set the headers
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      req = req.clone({ headers: req.headers.set('x-token', accessToken) })
      req = req.clone({ headers: req.headers.set('x-refresh-token', refreshToken) })
    }

    return next.handle(req).pipe(
      map((resp: any) => {
        if (resp instanceof HttpResponse) {
          const newAccessToken = resp.headers.get('x-token')
          const newRefreshToken = resp.headers.get('x-refresh-token')
          if (newAccessToken && newAccessToken !== accessToken) {
            localStorage.setItem('accessToken', newAccessToken)
          }

          if (newRefreshToken && newRefreshToken !== 'undefined' && newRefreshToken !== refreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }
        }
        return resp
      }),
      catchError((error: HttpErrorResponse) => throwError(error))
    )
  }
}
