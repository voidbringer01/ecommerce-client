import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopItemCrudComponent } from './shop-item-crud.component';

describe('ShopItemCrudComponent', () => {
  let component: ShopItemCrudComponent;
  let fixture: ComponentFixture<ShopItemCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopItemCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopItemCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
