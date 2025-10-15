import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieptInvoice } from './reciept-invoice';

describe('RecieptInvoice', () => {
  let component: RecieptInvoice;
  let fixture: ComponentFixture<RecieptInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecieptInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieptInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
