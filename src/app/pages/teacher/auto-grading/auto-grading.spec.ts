import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGrading } from './auto-grading';

describe('AutoGrading', () => {
  let component: AutoGrading;
  let fixture: ComponentFixture<AutoGrading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoGrading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoGrading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
