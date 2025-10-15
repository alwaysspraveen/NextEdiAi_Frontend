import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMarks } from './view-marks';

describe('ViewMarks', () => {
  let component: ViewMarks;
  let fixture: ComponentFixture<ViewMarks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMarks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMarks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
