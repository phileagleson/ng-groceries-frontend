import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AreaService } from '../../services/area.service'
import { ToastService } from '../../services/toast.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component'
import Item from '../../models/Item'
import GroceryList from 'src/app/models/GrocerList'

@Component({
  selector: 'app-grocery-detail',
  templateUrl: './grocery-detail.component.html',
  styleUrls: ['./grocery-detail.component.scss']
})
export class GroceryDetailComponent implements OnInit {
  areaName: string | null = ''
  areaId: string | null = ''
  items: Item[] = []
  editMode = false

  groceryList = []
  qty = 0
  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private areaService: AreaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.areaName = this.route.snapshot.paramMap.get('area')
    this.areaId = this.route.snapshot.paramMap.get('areaId')
    if (this.areaId) {
      const operations = {
        query: `
         query GetItemsForArea($areaId: ID!) {
            getItemsForArea(areaId: $areaId) {
              name
              _id
            }
         } `,
        variables: {
          areaId: this.areaId
        }
      }
      this.areaService.getItemsForArea(operations.query, operations.variables.areaId).subscribe((items) => {
        this.items = items
      })
    }
  }

  open() {
    const modalRef = this.modalService.open(AddItemModalComponent)
    if (this.areaName) {
      modalRef.componentInstance.selectedArea = this.areaId
    }
    modalRef.closed.subscribe((value) => {
      if (value?._id) {
        this.items.push(value)
        this.toastService.show('Item Added', { classname: 'mr-4 ml-auto bg-success text-light' })
      }
    })
  }

  enableEditMode() {
    this.editMode = !this.editMode
  }

  onItemDeleted(deletedItem: Item) {
    this.items = this.items.filter((item) => item._id !== deletedItem._id)
    this.toastService.show('Item Deleted', { classname: 'mr-4 ml-auto bg-warning text-light' })
    this.editMode = false
  }

  onItemUpdated(updatedItem: Item) {
    this.editMode = false
    const item = this.items.find((itemToFind) => itemToFind._id === updatedItem._id)
    if (item) {
      const index = this.items.indexOf(item)
      this.items[index] = updatedItem
      this.toastService.show('Item Updated', { classname: 'mr-4 ml-auto bg-success text-light' })
    }
  }

  onItemAddedToList() {
    this.toastService.show('Item Added to List', { classname: 'mr-4 ml-auto bg-success text-light' })
  }
}
