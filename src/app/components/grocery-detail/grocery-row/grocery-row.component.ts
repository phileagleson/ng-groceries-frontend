import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core'
import Item from '../../../models/Item'
import GroceryList from '../../../models/GrocerList'
import { AreaService } from '../../../services/area.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AddItemModalComponent } from '../add-item-modal/add-item-modal.component'

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
  constructor(private areaService: AreaService, private modalService: NgbModal) {}

  ngOnInit(): void {}

  addItemToList(item: Item) {
    //this.groceryService.addGroceryItem(itemToAdd)
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
    this.areaService.addItemToList(query, item._id).subscribe((res) => {
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
    const modalRef = this.modalService.open(AddItemModalComponent)
    if (this.areaId) {
      modalRef.componentInstance.selectedArea = this.areaId
      modalRef.componentInstance.item = this.item
      modalRef.componentInstance.title = 'Update Item'
      modalRef.componentInstance.buttonText = 'Update'
    }
    modalRef.closed.subscribe((updatedItem: Item) => {
      this.updatedItemEvent.emit(updatedItem)
    })
  }
}
