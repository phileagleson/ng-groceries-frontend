import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { GroceryDetailComponent } from './grocery-detail.component'

describe('GroceryDetailComponent', () => {
  let component: GroceryDetailComponent
  let fixture: ComponentFixture<GroceryDetailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroceryDetailComponent],
      imports: [RouterTestingModule]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
