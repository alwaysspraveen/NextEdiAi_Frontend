import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAttendance } from './daily-attendance';

describe('DailyAttendance', () => {
  let component: DailyAttendance;
  let fixture: ComponentFixture<DailyAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyAttendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
