import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAttendanceReport } from './my-attendance-report';

describe('MyAttendanceReport', () => {
  let component: MyAttendanceReport;
  let fixture: ComponentFixture<MyAttendanceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAttendanceReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAttendanceReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
