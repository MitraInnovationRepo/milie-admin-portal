import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishConfirmationDialogComponent } from './publish-confirmation-dialog.component';

describe('PublishConfirmationDialogComponent', () => {
  let component: PublishConfirmationDialogComponent;
  let fixture: ComponentFixture<PublishConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
