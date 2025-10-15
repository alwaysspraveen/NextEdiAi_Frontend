import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateGradeReports } from './generate-grade-reports';

describe('GenerateGradeReports', () => {
  let component: GenerateGradeReports;
  let fixture: ComponentFixture<GenerateGradeReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateGradeReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateGradeReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
