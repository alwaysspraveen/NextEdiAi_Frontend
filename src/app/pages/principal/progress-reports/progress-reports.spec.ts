import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressReports } from './progress-reports';

describe('ProgressReports', () => {
  let component: ProgressReports;
  let fixture: ComponentFixture<ProgressReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
