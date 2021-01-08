import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAreaModalComponent } from './add-new-area-modal.component';

describe('AddNewAreaModalComponent', () => {
  let component: AddNewAreaModalComponent;
  let fixture: ComponentFixture<AddNewAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAreaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
