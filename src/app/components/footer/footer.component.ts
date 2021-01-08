import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  copyDate = new Date().getFullYear()

  constructor() {}

  ngOnInit(): void {}
}
