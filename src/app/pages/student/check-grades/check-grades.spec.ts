import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckGrades } from './check-grades';

describe('CheckGrades', () => {
  let component: CheckGrades;
  let fixture: ComponentFixture<CheckGrades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckGrades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckGrades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
