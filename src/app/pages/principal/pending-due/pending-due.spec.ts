import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDue } from './pending-due';

describe('PendingDue', () => {
  let component: PendingDue;
  let fixture: ComponentFixture<PendingDue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingDue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
