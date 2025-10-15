import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWiseSummaryChart } from './class-wise-summary-chart';

describe('ClassWiseSummaryChart', () => {
  let component: ClassWiseSummaryChart;
  let fixture: ComponentFixture<ClassWiseSummaryChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassWiseSummaryChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassWiseSummaryChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
