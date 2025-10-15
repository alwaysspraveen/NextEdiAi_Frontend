import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTimetable } from './class-timetable';

describe('ClassTimetable', () => {
  let component: ClassTimetable;
  let fixture: ComponentFixture<ClassTimetable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassTimetable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassTimetable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
