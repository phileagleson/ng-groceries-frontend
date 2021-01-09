import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core'
import Item from '../../../models/Item'
import GroceryList from '../../../models/GrocerList'
import { AreaService } from '../../../services/area.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ItemModalComponent } from '../../item-modal/item-modal.component'
import { ToastService } from '../../../services/toast.service'

@Component({
  selector: 'tr[groceryRow]',
  templateUrl: './grocery-row.component.html',
  styleUrls: ['./grocery-row.component.scss']
})
export class GroceryRowComponent implements OnInit {
  @Input() item: Item = { _id: '', name: '' }
  @Input() editMode = false
  @Input() areaId: string | null = ''
  @Output() deletedItemEvent = new EventEmitter<Item>()
  @Output() updatedItemEvent = new EventEmitter<Item>()
  @Output() itemAddedToListEvent = new EventEmitter<GroceryList>()
  constructor(private areaService: AreaService, private modalService: NgbModal, private toastService: ToastService) {}

  ngOnInit(): void {}

  addItemToList(item: Item) {
    const query = `
    mutation AddItemToGroceryList($groceryId: ID!, $itemId: ID!) {
      addItemToGroceryList(groceryId: $groceryId, itemId: $itemId) {
        _id
        items {
          _id
          name
        }
      }
    }
    `
    const variables = {
      itemId: item._id,
      groceryId: ''
    }

    this.areaService.addItemToList(query, variables).subscribe((res) => {
      if (res._id) {
        this.itemAddedToListEvent.emit(res)
      }
    })
  }

  onDeleteItem(item: Item) {
    const query = `
    mutation DeleteItemFromArea($areaId: ID!, $itemId: ID!) {
      deleteItemFromArea(areaId: $areaId, itemId: $itemId) {
        _id
        name
      }
    }
    `
    const variables = {
      areaId: this.areaId,
      itemId: item._id
    }

    this.areaService.deleteItemFromArea(query, variables).subscribe((deletedItem: Item) => {
      this.deletedItemEvent.emit(deletedItem)
    })
  }

  open() {
    const modalRef = this.modalService.open(ItemModalComponent)
    if (this.areaId) {
      modalRef.componentInstance.selectedArea = this.areaId
      modalRef.componentInstance.item = this.item
      modalRef.componentInstance.title = 'Update Item'
      modalRef.componentInstance.buttonText = 'Update'
    }
    modalRef.closed.subscribe((updatedItem: Item) => {
      this.updateItem(updatedItem)
    })
  }

  updateItem(updatedItem: Item): void {
    const query = `
    mutation UpdateItem($name: String!, $itemId: ID!) {
      updateItem(name: $name, itemId: $itemId) {
        name
        _id
      }
    }
    `
    const variables = {
      name: updatedItem.name,
      itemId: this.item._id
    }
    this.areaService.updateItem(query, variables).subscribe((returnedItem: Item) => {
      this.item.name = returnedItem.name
      this.toastService.show('Item Updated', { classname: 'mr-4 ml-auto bg-success text-light' })
      this.updatedItemEvent.emit(returnedItem)
    })
  }
}
