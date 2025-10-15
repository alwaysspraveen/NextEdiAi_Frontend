import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentSubmission } from './view-student-submission';

describe('ViewStudentSubmission', () => {
  let component: ViewStudentSubmission;
  let fixture: ComponentFixture<ViewStudentSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudentSubmission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudentSubmission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
