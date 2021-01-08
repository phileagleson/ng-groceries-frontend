import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AreaService } from '../../../services/area.service'
import Item from '../../../models/Item'

@Component({
  selector: 'app-add-mater-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss']
})
export class AddItemModalComponent implements OnInit {
  @Input() selectedArea = ''
  @Input() item: Item = { name: '', _id: '' }
  @Input() title = 'Add New Item'
  @Input() buttonText = 'Add Item'
  @Output() updatedItemEvent = new EventEmitter<Item>()
  editMode = false

  addItemForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
  constructor(public activeModal: NgbActiveModal, private areaService: AreaService) {}

  ngOnInit(): void {
    if (this.item._id !== '') {
      this.editMode = true
      this.addItemForm.patchValue({
        name: this.item.name
      })
    }
  }

  onSubmit() {
    if (!this.editMode) {
      this.addNewItem()
    } else {
      this.updateItem()
    }
  }

  addNewItem(): void {
    const query = `
    mutation AddItemToArea($name: String!, $areaId: ID!) {
      addItemToArea(name: $name, areaId: $areaId) {
        name
        _id
      }
    }
    `
    const variables = {
      name: this.addItemForm.value.name,
      areaId: this.selectedArea
    }
    this.areaService.addItemToArea(query, variables).subscribe((item) => {
      this.activeModal.close(item)
    })
  }

  updateItem(): void {
    this.item.name = this.addItemForm.value.name
    const query = `
    mutation UpdateItem($name: String!, $itemId: ID!) {
      updateItem(name: $name, itemId: $itemId) {
        name
        _id
      }
    }
    `
    const variables = {
      name: this.addItemForm.value.name,
      itemId: this.item._id
    }
    this.areaService.updateItem(query, variables).subscribe((item) => {
      this.activeModal.close(item)
    })
  }
}
