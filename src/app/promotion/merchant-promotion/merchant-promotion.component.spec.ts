import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPromotionComponent } from './merchant-promotion.component';

describe('MerchantPromotionComponent', () => {
  let component: MerchantPromotionComponent;
  let fixture: ComponentFixture<MerchantPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
