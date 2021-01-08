import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  navbarOpen = false
  isAuthenticated = false
  sub: Subscription = new Subscription()

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated()
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['login'])
    this.isAuthenticated = false
  }
}
