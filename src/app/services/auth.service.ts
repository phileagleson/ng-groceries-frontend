import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, catchError, tap } from 'rxjs/operators'
import jwt_decode from 'jwt-decode'
import IUser from '../models/User'
import { ErrorService } from './error.service'

interface IRefreshToken {
  user: {
    id: string
    name: string
    email: string
  }
  iat: number
  exp: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | null>(null)
  // eslint-ignore-next-line
  user: Observable<IUser | null> = this.userSubject.asObservable()
  uri = '/graphql'
  constructor(private http: HttpClient, private errorService: ErrorService) {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken && refreshToken !== 'null' && refreshToken !== 'undefined') {
      console.log('in constructor')
      const decodedRefreshToken: IRefreshToken = jwt_decode(refreshToken)
      if (decodedRefreshToken?.user) {
        this.userSubject.next(decodedRefreshToken.user)
      }
    }
  }

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
          this.userSubject.next(res.body.data.loginUser)
        })
      )

  logout = (): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    this.userSubject.next(null)
  }

  isAuthenticated = (): boolean => {
    const accessToken = localStorage.getItem('accessToken')
    let refreshToken = localStorage.getItem('refreshToken')
    const today = new Date()

    if (refreshToken && refreshToken !== 'null' && refreshToken !== 'undefined') {
      const decodedRefreshToken: IRefreshToken = jwt_decode(refreshToken)
      const refreshExpDate = new Date(decodedRefreshToken.exp * 1000)
      if (refreshExpDate < today) {
        localStorage.removeItem('refreshToken')
        refreshToken = null
      }
    }

    if (accessToken && refreshToken) {
      return true
    }
    return false
  }
}
