import { Input, Component, HostListener, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  sideNavOpen = true
  screenWidth = 0
  screenHeight = 0

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    if (this.screenWidth <= 768 && this.sideNavOpen) {
      this.sideNavOpen = false
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    if (this.screenWidth <= 768) {
      this.sideNavOpen = false
    }
  }

  toggleSideNav($event: boolean): void {
    this.sideNavOpen = $event
  }
}
