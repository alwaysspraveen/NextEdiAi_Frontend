import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTimeTable } from './manage-time-table';

describe('ManageTimeTable', () => {
  let component: ManageTimeTable;
  let fixture: ComponentFixture<ManageTimeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTimeTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTimeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
