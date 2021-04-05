import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopActivationComponent } from './shop-activation.component';

describe('ShopActivationComponent', () => {
  let component: ShopActivationComponent;
  let fixture: ComponentFixture<ShopActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
