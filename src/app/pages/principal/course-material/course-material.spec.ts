import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMaterial } from './course-material';

describe('CourseMaterial', () => {
  let component: CourseMaterial;
  let fixture: ComponentFixture<CourseMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
