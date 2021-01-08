import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { HttpEventType } from '@angular/common/http'
import { AreaService } from '../../../services/area.service'
import Area from '../../../models/Area'

@Component({
  selector: 'app-add-new-area-modal',
  templateUrl: './add-new-area-modal.component.html',
  styleUrls: ['./add-new-area-modal.component.scss']
})
export class AddNewAreaModalComponent implements OnInit {
  @Input() title = 'Add New Area'
  @Input() editMode = false
  @Input() buttonText = 'Add Area'
  @Input() area: Area | null = null

  addAreaForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    areaImg: new FormControl(''),
    image: new FormControl('')
  })

  imgSrc: string | ArrayBuffer | null = ''
  image: File | null = null
  name = ''
  saving = false

  constructor(public activeModal: NgbActiveModal, private areaService: AreaService) {}

  ngOnInit(): void {
    if (this.editMode && this.area) {
      this.addAreaForm.patchValue({
        name: this.area.name
      })
      this.imgSrc = this.area.imageURL
    }
  }

  onSubmit() {
    this.name = this.addAreaForm.value.name
    this.saving = true
    this.addAreaForm.disable()
    if (!this.editMode) {
      const operations = {
        query: `
        mutation addNewArea($name: String!, $image: Upload!) {
          addArea(name: $name, imageUpload: $image) {
             _id
             name
             imageURL
         }
        }
         `,
        variables: {
          name: this.name,
          image: null
        }
      }

      this.areaService.addArea(this.image, operations).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // TODO: Add Upload Progress
        } else if (event.type === HttpEventType.Response) {
          let message = ''
          if (event.status === 200) {
            message = 'area added'
          } else {
            message = 'error' + event.statusText
          }
          this.activeModal.close(message)
        }
      })
    } else {
      // editing

      const operations = {
        query: `
             mutation UpdateArea($areaId: ID!, $name: String, $image: Upload) {
               updateArea(areaId: $areaId, name: $name, imageUpload: $image) {
                 _id
                 name
                 imageURL
               }
             }
           `,
        variables: {
          areaId: this.area?._id,
          name: this.name,
          image: null
        }
      }
      this.areaService.updateArea(this.image, operations).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          //TODO: Add Upload Progress
        } else if (event.type === HttpEventType.Response) {
          let message = ''
          if (event.status === 200) {
            message = 'area added'
          } else {
            message = 'error' + event.statusText
          }
          this.activeModal.close(message)
        }
      })
    }
  }

  onChange(e: Event) {
    const reader = new FileReader()
    reader.onload = () => {
      this.imgSrc = reader.result
    }
    const target = e.target as HTMLInputElement
    if (target?.files) {
      this.image = target.files[0]
      reader.readAsDataURL(target.files[0])
    }
  }
}
