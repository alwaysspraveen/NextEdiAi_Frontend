import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeachers } from './manage-teachers';

describe('ManageTeachers', () => {
  let component: ManageTeachers;
  let fixture: ComponentFixture<ManageTeachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTeachers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTeachers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
