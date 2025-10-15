import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitWork } from './submit-work';

describe('SubmitWork', () => {
  let component: SubmitWork;
  let fixture: ComponentFixture<SubmitWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
