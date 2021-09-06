import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewShopComponent } from './preview-shop.component';

describe('PreviewShopComponent', () => {
  let component: PreviewShopComponent;
  let fixture: ComponentFixture<PreviewShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
