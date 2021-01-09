import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ErrorService } from '../../services/error.service'

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  showErrors = false

  errors = new Observable<string[]>()

  constructor(public errorService: ErrorService) {}

  ngOnInit(): void {
    this.errors = this.errorService.errors.pipe(tap(() => (this.showErrors = true)))
  }

  onClose() {
    this.showErrors = false
  }
}
