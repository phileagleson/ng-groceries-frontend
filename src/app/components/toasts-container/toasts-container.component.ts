import { Component, HostBinding, OnInit, TemplateRef } from '@angular/core'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.scss']
  //host: { '[class.ngb-toasts]': 'true' }
})
export class ToastsContainerComponent implements OnInit {
  @HostBinding('[class.ngb-toasts]')
  protected get myClass() {
    return true
  }
  constructor(public toastService: ToastService) {}

  ngOnInit(): void {}

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef
  }
}
