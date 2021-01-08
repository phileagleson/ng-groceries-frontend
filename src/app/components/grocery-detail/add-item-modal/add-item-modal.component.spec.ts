import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

import { AddMasterItemModalComponent } from './add-master-item-modal.component'

describe('AddMaterItemModalComponent', () => {
  let component: AddMasterItemModalComponent
  let fixture: ComponentFixture<AddMasterItemModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMasterItemModalComponent],
      providers: [NgbActiveModal]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterItemModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
