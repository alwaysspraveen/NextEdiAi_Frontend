import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWiseSummary } from './class-wise-summary';

describe('ClassWiseSummary', () => {
  let component: ClassWiseSummary;
  let fixture: ComponentFixture<ClassWiseSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassWiseSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassWiseSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
