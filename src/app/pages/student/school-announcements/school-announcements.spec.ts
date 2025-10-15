import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAnnouncements } from './school-announcements';

describe('SchoolAnnouncements', () => {
  let component: SchoolAnnouncements;
  let fixture: ComponentFixture<SchoolAnnouncements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolAnnouncements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAnnouncements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
