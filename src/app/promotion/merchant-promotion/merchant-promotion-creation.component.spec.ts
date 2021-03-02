import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPromotionCreationComponent } from './merchant-promotion-creation.component';

describe('MerchantPromotionCreationComponent', () => {
  let component: MerchantPromotionCreationComponent;
  let fixture: ComponentFixture<MerchantPromotionCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantPromotionCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPromotionCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
