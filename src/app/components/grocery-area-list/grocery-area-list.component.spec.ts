import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { GroceryAreaListComponent } from './grocery-area-list.component'

describe('GroceryListComponent', () => {
  let component: GroceryAreaListComponent
  let fixture: ComponentFixture<GroceryAreaListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroceryAreaListComponent],
      imports: [RouterTestingModule]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryAreaListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
