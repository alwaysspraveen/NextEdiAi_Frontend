import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuizzes } from './create-quizzes';

describe('CreateQuizzes', () => {
  let component: CreateQuizzes;
  let fixture: ComponentFixture<CreateQuizzes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuizzes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuizzes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
