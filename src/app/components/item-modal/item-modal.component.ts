import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import Item from '../../models/Item'

@Component({
  selector: 'app-add-mater-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss']
})
export class ItemModalComponent implements OnInit {
  @Input() areaName = ''
  @Input() item: Item = { name: '', _id: '' }
  @Input() title = 'Add New Item'
  @Input() buttonText = 'Add Item'
  editMode = false

  itemForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  })

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.item._id !== '') {
      this.editMode = true
      this.itemForm.patchValue({
        name: this.item.name
      })
    }
  }

  onSubmit() {
    this.activeModal.close(this.itemForm.value)
  }
}
