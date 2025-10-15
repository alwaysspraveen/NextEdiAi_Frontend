import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalLayout } from './principal-layout';

describe('PrincipalLayout', () => {
  let component: PrincipalLayout;
  let fixture: ComponentFixture<PrincipalLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
