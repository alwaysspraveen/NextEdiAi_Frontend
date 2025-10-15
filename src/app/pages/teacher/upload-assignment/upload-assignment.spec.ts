import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAssignment } from './upload-assignment';

describe('UploadAssignment', () => {
  let component: UploadAssignment;
  let fixture: ComponentFixture<UploadAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAssignment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAssignment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
