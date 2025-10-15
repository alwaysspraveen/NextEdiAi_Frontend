import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamScheduling } from './exam-scheduling';

describe('ExamScheduling', () => {
  let component: ExamScheduling;
  let fixture: ComponentFixture<ExamScheduling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamScheduling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamScheduling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
