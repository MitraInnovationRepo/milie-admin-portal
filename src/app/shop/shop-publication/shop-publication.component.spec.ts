import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPublicationComponent } from './shop-publication.component';

describe('ShopPublicationComponent', () => {
  let component: ShopPublicationComponent;
  let fixture: ComponentFixture<ShopPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
