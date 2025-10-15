import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnrolledClasses } from './view-enrolled-classes';

describe('ViewEnrolledClasses', () => {
  let component: ViewEnrolledClasses;
  let fixture: ComponentFixture<ViewEnrolledClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEnrolledClasses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEnrolledClasses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
