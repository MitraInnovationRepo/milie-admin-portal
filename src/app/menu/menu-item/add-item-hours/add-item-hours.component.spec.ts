import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemHoursComponent } from './add-item-hours.component';

describe('AddItemHoursComponent', () => {
  let component: AddItemHoursComponent;
  let fixture: ComponentFixture<AddItemHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
