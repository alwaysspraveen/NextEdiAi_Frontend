import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMarks } from './enter-marks';

describe('EnterMarks', () => {
  let component: EnterMarks;
  let fixture: ComponentFixture<EnterMarks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterMarks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterMarks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
