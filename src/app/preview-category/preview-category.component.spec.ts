import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCategoryComponent } from './preview-category.component';

describe('PreviewCategoryComponent', () => {
  let component: PreviewCategoryComponent;
  let fixture: ComponentFixture<PreviewCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
