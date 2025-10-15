import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedResults } from './automated-results';

describe('AutomatedResults', () => {
  let component: AutomatedResults;
  let fixture: ComponentFixture<AutomatedResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomatedResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatedResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
