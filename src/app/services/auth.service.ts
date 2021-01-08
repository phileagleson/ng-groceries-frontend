import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import IUser from '../models/User'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uri = '/graphql'
  constructor(private http: HttpClient) {}

  login = (query: string, variables: any): Observable<any> =>
    this.http
      .post(
        this.uri,
        { query, variables },
        {
          observe: 'response'
        }
      )
      .pipe(
        tap((res: any) => {
          const accessToken = res.headers.get('x-token')
          const refreshToken = res.headers.get('x-refresh-token')
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
        })
      )

  logout = (): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (accessToken && refreshToken) {
      return true
    }
    return false
  }
}
