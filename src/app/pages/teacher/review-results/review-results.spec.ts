import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewResults } from './review-results';

describe('ReviewResults', () => {
  let component: ReviewResults;
  let fixture: ComponentFixture<ReviewResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
