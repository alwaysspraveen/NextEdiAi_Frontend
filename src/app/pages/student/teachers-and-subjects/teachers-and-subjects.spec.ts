import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersAndSubjects } from './teachers-and-subjects';

describe('TeachersAndSubjects', () => {
  let component: TeachersAndSubjects;
  let fixture: ComponentFixture<TeachersAndSubjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersAndSubjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersAndSubjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
