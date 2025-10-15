import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignedClasses } from './view-assigned-classes';

describe('ViewAssignedClasses', () => {
  let component: ViewAssignedClasses;
  let fixture: ComponentFixture<ViewAssignedClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssignedClasses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssignedClasses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
