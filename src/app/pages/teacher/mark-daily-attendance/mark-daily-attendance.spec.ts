import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkDailyAttendance } from './mark-daily-attendance';

describe('MarkDailyAttendance', () => {
  let component: MarkDailyAttendance;
  let fixture: ComponentFixture<MarkDailyAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkDailyAttendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkDailyAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
