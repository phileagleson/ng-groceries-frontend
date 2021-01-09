import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AreaService } from '../../services/area.service'
import { ToastService } from '../../services/toast.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ItemModalComponent } from '../item-modal/item-modal.component'
import Item from '../../models/Item'

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
      const query = `
         query GetItemsForArea($areaId: ID!) {
            getItemsForArea(areaId: $areaId) {
              name
              _id
            }
         } `

      const variables = {
        areaId: this.areaId
      }
      this.areaService.getItemsForArea(query, variables).subscribe((items) => {
        this.items = items
      })
    }
  }

  open() {
    const modalRef = this.modalService.open(ItemModalComponent)
    if (this.areaName) {
      modalRef.componentInstance.selectedArea = this.areaId
    }
    modalRef.closed.subscribe(({ name }: { name: string }) => {
      const query = `
    mutation AddItemToArea($name: String!, $areaId: ID!) {
      addItemToArea(name: $name, areaId: $areaId) {
        name
        _id
      }
    }
    `
      const variables = {
        name,
        areaId: this.areaId
      }
      this.areaService.addItemToArea(query, variables).subscribe((newItem: Item) => {
        this.items.push(newItem)
        this.toastService.show('Item Added', { classname: 'mr-4 ml-auto bg-success text-light' })
      })
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

  onItemUpdated() {
    this.editMode = false
  }

  onItemAddedToList() {
    this.toastService.show('Item Added to List', { classname: 'mr-4 ml-auto bg-success text-light' })
  }
}
