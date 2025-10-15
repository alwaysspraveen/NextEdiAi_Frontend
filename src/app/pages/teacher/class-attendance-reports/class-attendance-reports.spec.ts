import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAttendanceReports } from './class-attendance-reports';

describe('ClassAttendanceReports', () => {
  let component: ClassAttendanceReports;
  let fixture: ComponentFixture<ClassAttendanceReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassAttendanceReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassAttendanceReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
