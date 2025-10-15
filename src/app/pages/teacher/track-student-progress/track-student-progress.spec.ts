import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackStudentProgress } from './track-student-progress';

describe('TrackStudentProgress', () => {
  let component: TrackStudentProgress;
  let fixture: ComponentFixture<TrackStudentProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackStudentProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackStudentProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
