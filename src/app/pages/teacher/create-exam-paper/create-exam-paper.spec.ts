import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExamPaper } from './create-exam-paper';

describe('CreateExamPaper', () => {
  let component: CreateExamPaper;
  let fixture: ComponentFixture<CreateExamPaper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExamPaper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExamPaper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
