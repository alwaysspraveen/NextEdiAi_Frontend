import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotice } from './create-notice';

describe('CreateNotice', () => {
  let component: CreateNotice;
  let fixture: ComponentFixture<CreateNotice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNotice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNotice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
