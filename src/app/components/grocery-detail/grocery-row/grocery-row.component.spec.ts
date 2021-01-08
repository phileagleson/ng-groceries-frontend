import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryRowComponent } from './grocery-row.component';

describe('GroceryRowComponent', () => {
  let component: GroceryRowComponent;
  let fixture: ComponentFixture<GroceryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroceryRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
