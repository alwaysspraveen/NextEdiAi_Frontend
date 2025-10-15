import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMaterials } from './upload-materials';

describe('UploadMaterials', () => {
  let component: UploadMaterials;
  let fixture: ComponentFixture<UploadMaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadMaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadMaterials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
