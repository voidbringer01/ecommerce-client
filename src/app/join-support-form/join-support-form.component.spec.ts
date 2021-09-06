import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinSupportFormComponent } from './join-support-form.component';

describe('JoinSupportFormComponent', () => {
  let component: JoinSupportFormComponent;
  let fixture: ComponentFixture<JoinSupportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinSupportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinSupportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
