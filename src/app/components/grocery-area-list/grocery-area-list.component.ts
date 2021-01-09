import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import Area from '../../models/Area'
import { AddNewAreaModalComponent } from './add-new-area-modal/add-new-area-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AreaService } from '../../services/area.service'

const GET_AREAS_QUERY = `
    query AllAreas {
      areas {
        _id
        imageURL
        name
      }
    }
`

@Component({
  selector: 'app-grocery-area-list',
  templateUrl: './grocery-area-list.component.html',
  styleUrls: ['./grocery-area-list.component.scss']
})
export class GroceryAreaListComponent implements OnInit {
  groceryAreas: Area[] = []
  areas: Area[] = []
  editMode = false

  constructor(private router: Router, private modalService: NgbModal, private areaService: AreaService) {}

  ngOnInit(): void {
    this.updateAreas()
  }

  goToDetailPage(area: Area): void {
    this.router.navigate(['/groceries', area.name.toLowerCase(), area._id])
  }

  open(area?: Area) {
    if (!this.editMode) {
      const modalRef = this.modalService.open(AddNewAreaModalComponent)
      modalRef.closed.subscribe((addedArea: Area) => {
        if (addedArea) {
          this.updateAreas()
        }
      })
    } else {
      this.editMode = false
      const modalRef = this.modalService.open(AddNewAreaModalComponent)
      modalRef.componentInstance.editMode = true
      modalRef.componentInstance.title = 'Edit Area'
      modalRef.componentInstance.buttonText = 'Update'
      modalRef.componentInstance.area = area
      modalRef.closed.subscribe((updatedArea: Area) => {
        if (updatedArea) {
          this.updateAreas()
        }
      })
    }
  }

  updateAreas(): void {
    this.areaService.getAreas(GET_AREAS_QUERY).subscribe((areas) => {
      this.areas = areas
    })
  }

  toggleEditMode() {
    this.editMode = !this.editMode
  }

  deleteArea(area: Area) {
    const query = `
    mutation DeleteArea($areaId: ID!) {
      deleteArea(areaId: $areaId) {
        _id
        name
        imageURL
      }
    }
    `
    const variables = {
      areaId: area._id
    }

    this.areaService.deleteArea(query, variables).subscribe((deletedArea: Area) => {
      if (deletedArea) {
        this.areas = this.areas.filter((a) => a._id !== deletedArea._id)
        this.editMode = false
      }
    })
  }
}
