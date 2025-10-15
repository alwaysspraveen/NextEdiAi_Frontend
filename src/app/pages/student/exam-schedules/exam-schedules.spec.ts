import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSchedules } from './exam-schedules';

describe('ExamSchedules', () => {
  let component: ExamSchedules;
  let fixture: ComponentFixture<ExamSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSchedules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
