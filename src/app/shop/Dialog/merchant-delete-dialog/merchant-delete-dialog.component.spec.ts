import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantDeleteDialogComponent } from './merchant-delete-dialog.component';

describe('MerchantDeleteDialogComponent', () => {
  let component: MerchantDeleteDialogComponent;
  let fixture: ComponentFixture<MerchantDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
