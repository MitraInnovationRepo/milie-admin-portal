import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveConfirmationDialogComponent } from './approve-confirmation-dialog.component';

describe('ApproveConfirmationDialogComponent', () => {
  let component: ApproveConfirmationDialogComponent;
  let fixture: ComponentFixture<ApproveConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
