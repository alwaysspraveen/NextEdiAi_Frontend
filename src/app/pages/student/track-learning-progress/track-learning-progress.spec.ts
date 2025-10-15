import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackLearningProgress } from './track-learning-progress';

describe('TrackLearningProgress', () => {
  let component: TrackLearningProgress;
  let fixture: ComponentFixture<TrackLearningProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackLearningProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackLearningProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
