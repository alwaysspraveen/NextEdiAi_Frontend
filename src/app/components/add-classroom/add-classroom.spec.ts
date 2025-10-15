import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClass } from './add-classroom';

describe('CreateClass', () => {
  let component: CreateClass;
  let fixture: ComponentFixture<CreateClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
