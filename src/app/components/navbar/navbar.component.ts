import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Observable, Subscription } from 'rxjs'
import IUser from 'src/app/models/User'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  navbarOpen = false
  isAuthenticated = false
  sub: Subscription = new Subscription()
  userSub = new Subscription()
  user: IUser | null = null

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated()

    this.userSub = this.authService.user.subscribe((user: IUser | null) => {
      this.user = user
    })
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
    this.userSub.unsubscribe()
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['login'])
    this.isAuthenticated = false
  }
}
