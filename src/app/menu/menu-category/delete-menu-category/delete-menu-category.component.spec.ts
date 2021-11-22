import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMenuCategoryComponent } from './delete-menu-category.component';

describe('DeleteMenuCategoryComponent', () => {
  let component: DeleteMenuCategoryComponent;
  let fixture: ComponentFixture<DeleteMenuCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMenuCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
